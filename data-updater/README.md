# HESK Data Updater

The data updater automates the weekly reporting process for the HESK support dashboard.

It retrieves the latest SQL export, imports the database, generates reporting datasets and updates Google Sheets used by Looker Studio.

## Workflow

```text
Scheduled GitHub Action
        │
        ▼
Retrieve latest email
        │
        ▼
Extract SQL export link
        │
        ▼
Download ZIP
        │
        ▼
Extract SQL dump
        │
        ▼
Import into MySQL
        │
        ▼
Run reporting queries
        │
        ▼
Update Google Sheets
        │
        ▼
Apps Script refreshes summary sheets
        │
        ▼
Looker Studio dashboard
```

## Project Structure

```
src/
├── database.js
├── gmail.js
├── google.js
├── index.js
├── reports.js
├── sheets.js
└── zip.js
```

## Requirements

- Node.js
- MySQL
- Google OAuth Refresh Token
- Google Sheets API
- Gmail API

## Environment Variables

```
MYSQL_HOST=
MYSQL_PORT=
MYSQL_DB=
MYSQL_USER=
MYSQL_PASSWORD=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_REFRESH_TOKEN=

ZIP_PASSWORD=
EMAIL_SENDER=
SHEET_ID=
```

## Running Locally

```bash
npm install
npm start
```

## GitHub Actions

The production pipeline runs automatically every Monday at 09:15 SAST.

It uses:

- GitHub-hosted runner
- MySQL service container
- Repository Secrets for credentials
- Gmail API
- Google Sheets API

## Error Handling

The pipeline performs independent error handling for each stage:

- Email retrieval
- Download
- ZIP extraction
- Database import
- Report generation
- Google Sheets updates

This makes it easier to identify the exact point of failure when reviewing workflow logs.
