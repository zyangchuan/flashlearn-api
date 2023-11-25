const { createJWT } = require('./jwt');
const { Token } = require('../models')
const crypto = require('crypto');

const attachCookies = async (req, res, user) => {
  const jwtPayload = {
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    }
  };

  const accessToken = createJWT(jwtPayload);
  // 2 hour access token
  const accessExpiry = 1000 * 60 * 60 * 2;

  const refreshToken = crypto.randomBytes(40).toString('hex');
  // 7 days refresh token
  const refreshExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await Token.create({ 
    refresh_token: refreshToken,
    user_agent: req.headers['user-agent'],
    ip: req.ip,
    user_id: user.id
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + accessExpiry),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: refreshExpiry,
  });
};

module.exports = attachCookies;