const { google } = require("googleapis");
const auth = require("./google");

const sheetsClient = google.sheets({
  version: "v4",
  auth,
});

async function updateSheet(range, headings = [], data) {
  const sheets = sheetsClient;

  await sheets.spreadsheets.values.clear({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  if (headings.length) {
    const sheetName = range.split("!")[0];
    const headingRange = `${sheetName}!A1`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: headingRange,
      valueInputOption: "RAW",
      requestBody: {
        values: [headings],
      },
    });
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: data,
    },
  });
}

module.exports = { updateSheet };
