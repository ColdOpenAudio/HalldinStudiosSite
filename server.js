const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const requiredEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'CONTACT_TO',
  'CONTACT_FROM'
];

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);
if (missingEnvVars.length > 0) {
  console.warn(
    `Warning: Missing required environment variables: ${missingEnvVars.join(', ')}. ` +
      'Email delivery will fail until they are provided.'
  );
}

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '5', 10),
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, email, and message are required.'
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message
        .split('\n')
        .map((line) => `<p>${line}</p>`) // basic formatting
        .join('')}`
    });

    return res.json({ status: 'success', message: 'Thanks! Your message has been sent.' });
  } catch (error) {
    console.error('Failed to send email', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong while sending your message. Please try again later.'
    });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Halldin Studios contact backend listening on port ${PORT}`);
});
