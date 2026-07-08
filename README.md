# HESK Dashboard Automation

This repository contains the tooling used to automate the weekly update of the HESK support dashboard.

The automation replaces a repetitive manual workflow by downloading the latest HESK database export, generating reporting datasets, updating Google Sheets and refreshing the Looker Studio dashboard.

## Repository Structure

```
.
├── auth-app/        # Google OAuth utility application
└── data-updater/    # Weekly reporting pipeline
```

## Workflow

```text
GitHub Actions
        │
        ▼
 Gmail API
        │
        ▼
 Download SQL Export
        │
        ▼
 Extract SQL Dump
        │
        ▼
 Import into MySQL
        │
        ▼
 Run Reporting Queries
        │
        ▼
 Update Google Sheets
        │
        ▼
 Apps Script
        │
        ▼
 Looker Studio
```

## Applications

### auth-app

A small Express application used during development to complete the Google OAuth flow.

It allows authorization for Google APIs and generates a refresh token that is later used by the automation pipeline.

See [auth-app/README.md](./auth-app/README.md).

---

### data-updater

The production automation pipeline.

Responsibilities include:

- Reading the latest export email using Gmail API
- Downloading the password-protected SQL export
- Importing the database
- Running reporting SQL
- Updating Google Sheets
- Triggering the Looker Studio reporting pipeline

See [data-updater/README.md](./data-updater/README.md).

## Technologies

- Node.js
- Express
- Gmail API
- Google Sheets API
- MySQL
- GitHub Actions
- Looker Studio

## Automation

The pipeline is executed automatically every Monday using GitHub Actions.

```
Monday 09:15 SAST
        ↓
GitHub Actions
        ↓
Dashboard updated automatically
```
