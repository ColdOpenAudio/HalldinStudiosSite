Halldin Studios - Consulting & Music Production Website
------------------------------------------------------

This project now includes a lightweight Node.js backend that powers the contact form so
messages are delivered via email instead of relying on the browser's `mailto:` handler.

## Project Structure

- `index.html` – Marketing page markup and client-side enhancements (contact form handling, copy-to-clipboard helper).
- `style.css` – Styling for the landing page.
- `server.js` – Express server that accepts contact form submissions and relays them via SMTP.
- `.env.example` – Template for required environment variables.

## Requirements

- Node.js 18+ (for running the backend)
- SMTP credentials from your email provider (e.g., SendGrid, Mailgun, Gmail with App Passwords)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your SMTP credentials and preferred recipient
   address.

   ```bash
   cp .env.example .env
   ```

3. Start the backend server:

   ```bash
   npm start
   ```

   The server listens on `http://localhost:3001` by default and exposes a `POST /api/contact`
   endpoint. It also supports CORS configuration through the `ALLOWED_ORIGINS` environment
   variable for scenarios where the frontend is hosted separately.

4. Serve the frontend from the same origin (recommended) or configure your hosting platform to
   proxy `/api/contact` to the backend.

## Deployment Notes

- Keep your `.env` file private—never commit real credentials to version control.
- When deploying, configure the environment variables in your hosting provider's dashboard.
- Verify the SMTP connection by checking the server logs for
  `"SMTP connection verified. Ready to send messages."`
- The backend exposes a `/health` endpoint that returns `{ "status": "ok" }` to assist with
  uptime checks.
