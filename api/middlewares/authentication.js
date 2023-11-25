const { User, Token } = require('../models');
const { isTokenValid, attachCookies } = require('../utils');
const { UnauthenticatedError } = require('../errors');

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  if (accessToken) {
    const payload = isTokenValid(accessToken);
    req.user = payload.user
    return next();

  } else if (refreshToken) {
    console.log(refreshToken)
    const token = await Token.findOne({ where: { refresh_token: refreshToken } });
    console.log(token)
    if (!token) throw new UnauthenticatedError('Invalid Token.');
    if (new Date() >= token.expiry) throw new UnauthenticatedError('Invalid Token.');
    
    const user = await User.findOne({ where: { id: token.user_id } });
    await attachCookies(req, res, user)

    // Revoke old refresh token in the database
    await token.destroy();

    req.user = user;
    return next();
  } else {
    throw new UnauthenticatedError('Unauthenticated');
  }
}

module.exports = authenticateUser;