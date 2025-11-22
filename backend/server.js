require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", methods: "GET,POST,OPTIONS", allowedHeaders: "Content-Type" }));

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Root route (health check)
app.get("/", (req, res) => res.send("✅ Server is online and active!"));

// POST /send-email route
app.post("/send-email", async (req, res) => {
  const { name, email, service, details } = req.body;

  try {
    const message = `
Name: ${name}
Email: ${email}
Service Required: ${service}

Project Details:
${details}
    `;

    const data = await resend.emails.send({
      from: process.env.RESEND_SENDER,    // Verified sender on Resend
      to: process.env.RESEND_RECEIVER,    // Your email to receive messages
      subject: `New Quote Request from ${name}`,
      text: message
    });

    console.log("Email sent:", data);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Resend Error:", error);
    res.status(500).json({ message: "Error sending email", error });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
