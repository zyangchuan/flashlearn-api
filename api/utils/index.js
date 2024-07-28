const { createJWT, isTokenValid } = require('./jwt');
const attachCookies = require('./attachCookies');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/sendEmail');
const createStudyCardSet = require('./study/createStudyCardSet');
const getStudyCardSet = require('./study/getStudyCardSet');

module.exports = {
  createJWT,
  isTokenValid,
  attachCookies,
  sendVerificationEmail,
  sendPasswordResetEmail,
  createStudyCardSet,
  getStudyCardSet
}