const { User, Token } = require('../models');
const { attachCookies, sendVerificationEmail, sendPasswordResetEmail } = require('../utils');
const { literal } = require('sequelize');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
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
  if (emailExists) throw new BadRequestError('The email is already in use.');

  // Check if username exists
  const nameExists = await User.findOne({ where: { username: username }, attributes: ['username'] });
  if (nameExists) throw new BadRequestError('The username is already in use.');

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  
  // Verification token
  const verificationToken = crypto.randomBytes(40).toString('hex');

  // Create a new user
  const user = await User.create({ 
    email: email, 
    username: username, 
    password: password,
    verification_token: verificationToken
  });

  await sendVerificationEmail(user.email, user.verification_token);

  res.status(StatusCodes.CREATED).json({ user });
}

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.query;

  // Check if email exists
  const emailExists = await User.findOne({ where: { email: email }, attributes: ['email'] });
  if (!emailExists) throw new BadRequestError('The link is invalid');

  const user = await User.findOne({ where: { email: email }});

  if (user.verified) throw new BadRequestError('Email is already verified');

  if (verificationToken !== user.verification_token) {
    throw new BadRequestError('The link is invalid');
  }

  await user.update({ verified: 1 });

  res.status(StatusCodes.OK).json({ msg: 'Email verified' });
}

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ where: { email: email } });
  if (!user) throw new UnauthenticatedError('Invalid crendentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  if (!user.verified) {
    throw new UnauthenticatedError('Please verify your email');
  }

  const jwtPayload = {
    user: {
      userId: user.id,
      email: user.email,
      username: user.username
    }
  };

  // Generate access token and refresh token
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const refreshExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  attachCookies(res, jwtPayload, refreshToken, refreshExpiry);

  await Token.create({ 
    refresh_token: refreshToken,
    user_agent: req.headers['user-agent'],
    ip: req.ip,
    userId: user.id
  });

  res.status(StatusCodes.OK).json({ msg: 'ok' });
}

const logout = async (req, res) => {
  const { refreshToken } = req.signedCookies;

  if (refreshToken) {
    // Revoke refresh token in database
    await Token.destroy({ where: { refresh_token: refreshToken } });
  }

  // Clear cookies in the client's browser
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
}

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.signedCookies;
  
  if (refreshToken) {
    const token = await Token.findOne({ where: { refresh_token: refreshToken } });
    if (!token) throw new UnauthenticatedError('Invalid Token');
    if (new Date() >= token.expiry) throw new UnauthenticatedError('Invalid Token');
    
    const user = await User.findOne({ where: { id: token.userId } });
    const jwtPayload = {
      user: {
        userId: user.id,
        email: user.email,
        username: user.username
      }
    };
    req.user = jwtPayload.user;

    // Generate a new pair of access token and refresh token
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const tokenExpiry = new Date(token.expiry);
    attachCookies(res, jwtPayload, newRefreshToken, tokenExpiry);

    await Token.create({ 
      refresh_token: newRefreshToken,
      user_agent: req.headers['user-agent'],
      ip: req.ip,
      userId: user.id
    });

    // Revoke old refresh token in the database
    await token.destroy();
    res.status(StatusCodes.OK).json({ msg: 'New access token returned' });
  }
  throw new UnauthenticatedError('Unauthenticated');
};

const resetPassword = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  // Verification token
  const passwordToken = crypto.randomBytes(40).toString('hex');
  user.password_token = passwordToken;
  user.password_token_expiry = literal('(NOW() + INTERVAL 1 DAY)');
  await user.save();

  await sendPasswordResetEmail(user.email, passwordToken);

  res.status(StatusCodes.OK).json({ msg: 'Reset password email sent' });
}

const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { email, password, passwordToken } = req.body;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const tokenMatch = user.password_token === passwordToken;
  const hasExpired = new Date() >= new Date(user.password_token_expiry);
  if (!tokenMatch || hasExpired) {
    throw new UnauthenticatedError('Invalid Token');
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

  res.status(StatusCodes.OK).json({ msg: 'Password changed' });
}

const changeUsername = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { username } = req.body;
  const user = await User.findOne({ where: { id: req.user.userId } });

  user.username = username;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Username updated' });
}

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  refreshAccessToken,
  resetPassword,
  changePassword,
  changeUsername
}