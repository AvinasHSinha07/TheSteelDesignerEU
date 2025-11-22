require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Gmail SMTP Transporter (Render-safe)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Root route (for Render health check)
app.get('/', (req, res) => {
    res.send('✅ Server is online and active!');
});

// Email sending route
app.post('/send-email', async (req, res) => {
    const { name, email, service, details } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,   // Required by Gmail
        replyTo: email,                 // User email sent as reply-to
        to: process.env.EMAIL_USER,
        subject: `New Quote Request from ${name}`,
        text: `
Name: ${name}
Email: ${email}
Service Required: ${service}

Project Details:
${details}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('❌ Email Error:', error);
        res.status(500).json({ message: 'Error sending email', error });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
