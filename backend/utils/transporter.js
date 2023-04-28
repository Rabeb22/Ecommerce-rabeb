const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// configure the transporter for nodemailer to use gmail account to send mails
const transporter = nodemailer.createTransport({
  host: `smtp-mail.outlook.com`,
  port: 587,
  secureConnection: false, // TLS requires secureConnection to be false
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = transporter;
