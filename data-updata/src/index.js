require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { getLatestZipUrl } = require("./gmail");
const { downloadZip, extractZip } = require("./zip");
const { importDump } = require("./database");
const { runReports } = require("./reports");
const { updateSheet } = require("./sheets");

async function run() {
  console.log("***START***");

  let zipPath;
  let extractDir;

  // =====================
  // DOWNLOAD STAGE
  // =====================
  try {
    const zipUrl = await getLatestZipUrl();
    console.log("ZIP URL:", zipUrl);

    zipPath = await downloadZip(zipUrl);
    console.log("Downloaded ZIP");
  } catch (err) {
    console.error("❌ Download stage failed:", err);
    return;
  }

  // =====================
  // EXTRACT STAGE
  // =====================
  try {
    extractDir = await extractZip(zipPath);
    console.log("Extracted:", extractDir);
    console.log("Files:", fs.readdirSync(extractDir));
  } catch (err) {
    console.error("❌ Extract stage failed:", err);
    return;
  }

  // =====================
  // IMPORT STAGE
  // =====================
  let sqlPath;

  try {
    const sqlFile = fs
      .readdirSync(extractDir)
      .find((file) => file.endsWith(".sql"));

    if (!sqlFile) {
      throw new Error("No SQL file found in extracted folder");
    }

    sqlPath = path.join(extractDir, sqlFile);

    await importDump(sqlPath);
    console.log("DB imported");
  } catch (err) {
    console.error("❌ Import stage failed:", err);
    return;
  }

  // =====================
  // REPORTS STAGE
  // =====================
  let ticketsReport, replyRatingsReport, agentCsatReport;

  try {
    ({ ticketsReport, replyRatingsReport, agentCsatReport } =
      await runReports());
  } catch (err) {
    console.error("❌ Reports stage failed:", err);
    return;
  }

  // =====================
  // SHEETS STAGE
  // =====================
  try {
    await updateSheet(
      "RAW_DATA!A2:Z",
      Object.keys(ticketsReport[0]),
      ticketsReport.map(Object.values),
    );

    await updateSheet(
      "reply_ratings!A2:Z",
      Object.keys(replyRatingsReport[0]),
      replyRatingsReport.map(Object.values),
    );

    await updateSheet(
      "agent_csat!A1:Z",
      Object.keys(agentCsatReport[0]),
      agentCsatReport.map(Object.values),
    );

    console.log("Sheets updated");
  } catch (err) {
    console.error("❌ Sheets stage failed:", err);
    return;
  }

  // =====================
  // CLEANUP (always runs if we reach here)
  // =====================
  try {
    fs.rmSync("./extract", { recursive: true, force: true });
    fs.rmSync("./temp.zip", { force: true });
  } catch (err) {
    console.error("⚠️ Cleanup warning:", err);
  }

  console.log("***DONE***");
}

run().catch(console.error);
