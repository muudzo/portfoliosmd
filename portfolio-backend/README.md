# Portfolio Backend

Backend server for the TATENDA NYEMUDZO portfolio website. Handles contact form submissions and sends emails via Gmail SMTP.

## Features

- Contact form API endpoint
- Email sending via Nodemailer
- CORS configuration for frontend integration
- Environment-based configuration

## Environment Variables

Create a `.env` file with the following variables:

```bash
PORT=5050
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Installation

```bash
npm install
```

## Running Locally

```bash
npm start
```

Server will run on `http://localhost:5050`

## API Endpoints

### Health Check
```
GET /health
```

### Contact Form
```
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

## Deployment

This backend is designed to be deployed on Render.com. See deployment instructions in the main repository README.

## Technologies

- Node.js
- Express
- Nodemailer
- CORS
- dotenv
