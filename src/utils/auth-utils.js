const { SUPERUSERS } = require("../data/constants");
const nodemailer = require("nodemailer");

const emailConfirmationPage = require("../data/email_confirmation_page");

exports.isSuperuser = (userRole) => {
  if (!SUPERUSERS.hasOwnProperty(userRole)) {
    return false;
  }

  return true;
};

exports.sendConfirmationEmail = async (email, queryString) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Verify Your Email Address",
    html: emailConfirmationPage(queryString),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    throw new Error(`Error sending email: ${error}`);
  }
};
