const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Enables JSON data processing

// Default Route
app.get('/', (req, res) => {
    res.send("Portfolio Backend is Running!");
});

// Contact Form API Route
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    console.log("Received Contact Form Request:", req.body); // ✅ Log the data

    if (!name || !email || !message) {
        console.log("❌ Missing required fields"); // Debugging missing fields
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            text: message
        });

        console.log("✅ Email Sent Successfully!");
        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        console.error("❌ Error sending email:", error); // ❌ Log any email errors
        res.status(500).json({ error: "Error sending message" });
    }
});


// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
