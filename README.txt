Halldin Studios - Consulting & Music Production Website
-----------------------------------------------------
This project includes a static marketing site and a lightweight Node.js backend so the
contact form can send emails through your SMTP provider.

Key files:
- index.html   – main page
- style.css    – site styling
- server.js    – Express server that handles contact form submissions
- package.json – backend dependencies & scripts
- .env.example – template for required environment variables

## Running the backend locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example` and provide your SMTP credentials.
3. Start the server:
   ```bash
   npm start
   ```
4. Open `index.html` in your browser. The form will POST to `http://localhost:3001/api/contact`.

The `/api/contact` endpoint validates form fields and sends the email via Nodemailer. Rate
limiting, CORS, and Helmet are configured to help harden the endpoint.
