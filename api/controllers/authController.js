const { User, Token } = require('../models');
const { attachCookies, sendVerificationEmail, sendPasswordResetEmail } = require('../utils');
const { literal } = require('sequelize');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { google } = require('googleapis');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { email, username } = req.body;

  // Check if email exists
  const emailExists = await User.findOne({ where: { email: email }, attributes: ['email'] });
  if (emailExists) throw new BadRequestError('email_taken');

  // Check if username exists
  const nameExists = await User.findOne({ where: { username: username }, attributes: ['username'] });
  if (nameExists) throw new BadRequestError('username_taken');

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
  // Verification token
  const verificationToken = crypto.randomBytes(40).toString('hex');

  // Create a new user 
  const user = await User.create({ 
    email: email, 
    username: username, 
    password: hashedPassword,
    verification_token: verificationToken
  });

  await sendVerificationEmail(user.email, user.verification_token);

  res.status(StatusCodes.CREATED).json({ user });
}

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.query;

  // Check if email exists
  const emailExists = await User.findOne({ where: { email: email }, attributes: ['email'] });
  if (!emailExists) throw new BadRequestError('invalid_link');

  const user = await User.findOne({ where: { email: email }});

  if (user.verified) throw new BadRequestError('email_already_verified');

  if (verificationToken !== user.verification_token) {
    throw new BadRequestError('invalid_link');
  }

  await user.update({ verified: 1 });

  res.set({ 'Location': process.env.BASE_URL + '/email-verified' });
  res.status(StatusCodes.MOVED_PERMANENTLY).json({ msg: 'Email verified.' });
}

const login = async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ where: { email: email } });
  if (!user) throw new UnauthenticatedError('invalid_credentials');
  if (user.id.startsWith('google_')) throw new BadRequestError('Please try signing in with Google.');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid_credentials');
  }

  if (!user.verified) {
    throw new UnauthenticatedError('email_not_verified');
  }

  // Attach access token and refresh token
  await attachCookies(req, res, user);

  res.status(StatusCodes.OK).json({ msg: `${user.username} logged in.` });
}

const logout = async (req, res) => {
  const { refreshToken } = req.signedCookies;

  if (refreshToken) {
    // Revoke refresh token in database
    await Token.destroy({ where: { refresh_token: refreshToken } });
  }

  // Clear cookies in the client's browser
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(StatusCodes.OK).json({ msg: `User logged out.` });
}

// const refreshAccessToken = async (req, res) => {
//   const { refreshToken } = req.signedCookies;
  
//   if (refreshToken) {
//     const token = await Token.findOne({ where: { refresh_token: refreshToken } });
//     if (!token) throw new UnauthenticatedError('Invalid Token.');
//     if (new Date() >= token.expiry) throw new UnauthenticatedError('Invalid Token.');
    
//     const user = await User.findOne({ where: { id: token.user_id } });
//     attachCookies(req, res, user)

//     // Revoke old refresh token in the database
//     await token.destroy();
//     res.status(StatusCodes.OK).json({ msg: 'New access token returned' });
//   }
//   throw new UnauthenticatedError('Unauthenticated.');
// };

const resetPassword = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    throw new UnauthenticatedError('invalid_credentials');
  }

  // Verification token
  const passwordToken = crypto.randomBytes(40).toString('hex');
  user.password_token = passwordToken;
  user.password_token_expiry = literal('(NOW() + INTERVAL 1 DAY)');
  await user.save();

  await sendPasswordResetEmail(user.email, passwordToken);

  res.status(StatusCodes.OK).json({ msg: 'Reset password email sent.' });
}

const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { email, password, passwordToken } = req.body;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    throw new UnauthenticatedError('invalid_credentials');
  }
  const tokenMatch = user.password_token === passwordToken;
  const hasExpired = new Date() >= new Date(user.password_token_expiry);
  if (!tokenMatch || hasExpired) {
    throw new UnauthenticatedError('invalid_token');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);

  // Update user password
  user.password = newPassword;
  user.password_token_expiry = literal('NOW()');
  // Revoke all refresh tokens
  await Token.destroy({ where: { userId: user.id } });
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Password changed.' });
}

const changeUsername = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { username } = req.body;
  const user = await User.findOne({ where: { id: req.user.id } });

  user.username = username;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Username updated.' });
}

const googleSignIn = async (req, res) => {
  const { state, code } = req.query;

  if (state != 'google_sign_in') throw new BadRequestError('State does not match.');

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.BASE_URL + '/api/v1/auth/google'
  );

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials({ access_token: tokens.access_token });
  
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });
  const { data } = await oauth2.userinfo.get();

  let user = await User.findOne({ where: { email: data.email } });
  
  if (!user) {
    user = await User.create({ 
      id: 'google_' + data.id,
      email: data.email, 
      username: data.name,
      verified: true
    });
  }

  // Attach access token and refresh token
  await attachCookies(req, res, user);

  res.redirect(process.env.BASE_URL + '/app/dashboard');
}

const getUserInfo = async (req, res) => {
  const { id, email, username } = req.user;
  res.status(StatusCodes.OK).json({ user: { id: id, email: email, username: username } });
}

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  resetPassword,
  changePassword,
  changeUsername,
  googleSignIn,
  getUserInfo
}