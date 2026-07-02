const fs = require("fs");
const { extractFull } = require("node-7z");
const pathTo7zip = require("7zip-bin").path7za;

// give executional permissions
try {
  fs.chmodSync(pathTo7zip, 0o755);
} catch {}

async function downloadZip(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to download ZIP: ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  fs.writeFileSync("./temp.zip", buffer);

  return "./temp.zip";
}

function extractZip(zipPath) {
  const outputDir = "./extract";

  return new Promise((resolve, reject) => {
    const stream = extractFull(zipPath, outputDir, {
      $bin: pathTo7zip,
      password: process.env.ZIP_PASSWORD,
    });

    stream.on("end", () => resolve(outputDir));
    stream.on("error", reject);
  });
}

module.exports = { downloadZip, extractZip };
