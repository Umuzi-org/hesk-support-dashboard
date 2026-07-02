const { google } = require("googleapis");
const auth = require("./google");

const gmailClient = google.gmail({
  version: "v1",
  auth,
});

function decodeBase64(data) {
  return Buffer.from(data, "base64").toString("utf8");
}

function extractZipUrl(text) {
  const match = text.match(/https?:\/\/[^\s]+\.zip/);
  if (!match) throw new Error("No ZIP URL found in email");
  return match[0];
}

async function getLatestZipUrl() {
  const gmail = gmailClient;

  console.log(`sender: ${process.env.GMAIL_SENDER}`)
  
  const res = await gmail.users.messages.list({
    userId: "me",
    q: `from:${process.env.GMAIL_SENDER}`,
    maxResults: 1,
  });

  console.log(`res: ${res}`)

  const messageId = res.data.messages?.[0]?.id;
  if (!messageId) throw new Error("No email found");

  const msg = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });

  let body = "";

  const parts = msg.data.payload.parts || [];

  for (const part of parts) {
    if (part.mimeType === "text/plain" && part.body?.data) {
      body += decodeBase64(part.body.data);
    }
  }

  if (!body) {
    // fallback: sometimes body is in payload.body
    if (msg.data.payload.body?.data) {
      body = decodeBase64(msg.data.payload.body.data);
    }
  }

  return extractZipUrl(body);
}

module.exports = { getLatestZipUrl };
