const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const PORT = 5000;

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

async function sendMail() {
  const testAccount = await nodemailer.createTestAccount();

  console.log("Ethereal user:", testAccount.user);
  console.log("Ethereal pass:", testAccount.pass);

}
sendMail().catch(console.error);

app.post('/test', (req, res) => {
  console.log('✅ Test route hit');
  res.status(200).json({ message: 'Test successful' });
});

app.listen(PORT, () => {
  console.log(`🟢 Test server running on port ${PORT}`);
});
