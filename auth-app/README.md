# Google OAuth Utility

This application is a small Express server used to authenticate with Google and generate a long-lived refresh token.

The refresh token is used by the automation pipeline to access Google services without requiring manual login.

## Features

- Google OAuth 2.0 login
- Gmail API authorization
- Google Sheets API authorization
- Refresh token generation

## Tech Stack

- Express
- Passport.js
- Google OAuth 2.0
- Pug

## Usage

```bash
npm install
npm start
```

Open

```
http://localhost:3000
```

Authenticate with Google and complete the OAuth flow.

The generated refresh token(in the terminal) can then be stored securely as a GitHub Actions Secret.

## Purpose

This application is only required when:

- obtaining a new refresh token
- changing Google accounts
- modifying OAuth scopes

It is **not** used during the scheduled automation.
