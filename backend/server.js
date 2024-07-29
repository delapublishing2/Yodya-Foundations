const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('process.env.STRIPE_SECRET_KEY');

const app = express();



app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'apple_pay'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Donation'
                },
                unit_amount: amount * 100
            },
            quantity: 1
        }],
        mode: 'payment',
        success_url: 'https://yourdomain.com/success',
        cancel_url: 'https://yourdomain.com/cancel'
    });

    res.json({ id: session.id });
});

app.listen(3000, () => console.log('Server running on port 3000'));



app.post('/submit', async (req, res) => {
    const { name, email, phone, message } = req.body;
  
    console.log('Form Data:', { name, email, phone, message }); // Add this line
  
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
      res.status(500).send('Error sending email: ' + error);
    }
  });
  