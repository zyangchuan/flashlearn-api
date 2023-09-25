let nodemailer = require('nodemailer');

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  host: 'email-smtp.ap-southeast-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

// send some mail
const sendVerificationEmail = async (email, token) => {
  await transporter.sendMail(
    {
      from: {
        name: "FlashLearn",
        address: "verification@flashlearn.io"
      },
      to: email,
      subject: "Verify your email",
      text: 
        "Welcome to FlashLearn! Click on the link to verify your email: " + 
        process.env.NODE_ENV==='production' ? 'https://www.flashlearn.io' : 'http://www.localhost:3000' +
        `/verify-email?email=${email}&verificationToken=${token}`,
    }
  );
}

const sendPasswordResetEmail = async (email, token) => {
  await transporter.sendMail(
    {
      from: {
        name: "FlashLearn",
        address: "reset-password@flashlearn.io"
      },
      to: email,
      subject: "Reset your password",
      text:
        "Click on the link to reset your password: " +
        process.env.NODE_ENV==='production' ? 'https://www.flashlearn.io' : 'http://www.localhost:3000' +
        `/reset-password?email=${email}&passwordToken=${token}`,
    }
  );
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
