require("dotenv").config();

const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sendEmailFunc = (message) => {
  message.from = "victorhachkajlo@gmail.com";

  return transport.sendMail(message);
};

module.exports = sendEmailFunc;
