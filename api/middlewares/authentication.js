const { Token, User } = require('../models');
const { isTokenValid, attachCookies } = require('../utils');
const { UnauthenticatedError } = require('../errors');
const crypto = require('crypto');

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  if (accessToken) {
    const payload = isTokenValid(accessToken);
    req.user = payload.user
    return next();
  } 

  // If access token expired
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

    return next();
  }

  throw new UnauthenticatedError('Unauthenticated');
}

module.exports = authenticateUser;