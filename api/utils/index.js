const { createJWT, isTokenValid } = require('./jwt');
const attachCookies = require('./attachCookies');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/sendEmail');

module.exports = {
  createJWT,
  isTokenValid,
  attachCookies,
  sendVerificationEmail,
  sendPasswordResetEmail
}