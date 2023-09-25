const { Token, User } = require('../models');
const { isTokenValid, attachCookies } = require('../utils');
const { UnauthenticatedError } = require('../errors');
const crypto = require('crypto');

const authenticateUser = async (req, res, next) => {
  const { accessToken } = req.signedCookies;

  if (accessToken) {
    const payload = isTokenValid(accessToken);
    req.user = payload.user
    return next();
  }

  throw new UnauthenticatedError('Unauthenticated');
}

module.exports = authenticateUser;