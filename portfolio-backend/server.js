const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// CORS Configuration with multiple origin support
const allowedOrigins = [
    'http://localhost:3000',     // Local frontend development
    'http://localhost:5500',     // Live server extension
    'http://localhost:8000',     // Python local server
    'http://127.0.0.1:8000',     // Python local server (loopback)
];

// Configuring CORS with options
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);

        // Allow localhost origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Allow any Netlify domain (*.netlify.app)
        if (origin && origin.match(/https:\/\/.*\.netlify\.app$/)) {
            return callback(null, true);
        }

        // Allow production domain
        if (origin && origin === 'https://smddevelopers.com') {
            return callback(null, true);
        }

        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 204
}));

// Parse JSON request bodies
app.use(express.json());

// Requesting  logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Default Route
app.get('/', (req, res) => {
    res.send("Portfolio Backend is Running!");
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Contact Form API Route
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    console.log("Received Contact Form Request:", req.body);

    // Validating request data
    if (!name || !email || !message) {
        console.log("Missing required fields:", { name, email, message });
        return res.status(400).json({ error: "All fields are required" });
    }

    // Validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Checking for required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing email configuration in environment variables");
        return res.status(500).json({ error: "Server configuration error" });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const emailContent = `
Name: ${name}
Email: ${email}

Message:
${message}

Sent from: SMD Developers Portfolio
        `;

        const mailOptions = {
            from: `"SMD Portfolio" <${process.env.EMAIL_USER}>`,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            text: emailContent
        };

        await transporter.sendMail(mailOptions);

        console.log("Email Sent Successfully!");
        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);

        // Log the error and return a generic message to the user
        res.status(500).json({
            error: "Error sending message. Please try again later."
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Something went wrong" });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
