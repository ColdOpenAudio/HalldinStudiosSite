const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.warn(`Warning: Missing required SMTP environment variables: ${missingEnv.join(', ')}`);
}

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (allowedOrigins.length) {
  app.use(
    cors({
      origin: allowedOrigins,
      methods: ['POST', 'OPTIONS'],
    })
  );
} else {
  app.use(cors());
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

if (!missingEnv.length && process.env.NODE_ENV !== 'test') {
  transporter.verify((error, success) => {
    if (error) {
      console.error('Error verifying SMTP configuration:', error.message);
    } else {
      console.log('SMTP connection verified. Ready to send messages.');
    }
  });
}

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (missingEnv.length) {
    return res.status(500).json({
      error: 'Email service is not configured. Please try again later.',
    });
  }

  const recipient = process.env.CONTACT_RECIPIENT || process.env.SMTP_USER;

  const mailOptions = {
    from: `${name} <${process.env.SMTP_USER}>`,
    replyTo: email,
    to: recipient,
    subject: `New inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ error: 'Unable to send message at this time.' });
  }
});

let serverInstance;

const start = () => {
  if (!serverInstance) {
    serverInstance = app.listen(port, () => {
      console.log(`Contact form server running on port ${port}`);
    });
  }
  return serverInstance;
};

if (require.main === module) {
  start();
}

module.exports = { app, start };
