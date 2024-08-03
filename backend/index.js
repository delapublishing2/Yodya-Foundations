const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://yodya.org'], // Replace with your actual frontend URLs
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Ensure the body parser can handle JSON
app.use(express.static('docs'));

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/docs/english.html');
});

app.post('/submit', async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log('Form Data:', { name, email, phone, message });

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL,
      subject: 'New Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    const result = await transporter.sendMail(mailOptions);
    res.status(200).send('Form submitted successfully!');
  } catch (error) {
    console.error('Error sending email:', error); // Log the error
    res.status(500).send('Error sending email: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err); // Log the unhandled error
  res.status(500).send('Internal Server Error');
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});