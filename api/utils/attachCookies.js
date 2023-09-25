const { createJWT } = require('./jwt');

const attachCookies = (res, jwtPayload, refreshToken, refreshExpiry) => {
  const accessToken = createJWT(jwtPayload);
  // 2 hour access token
  const accessExpiry = 1000 * 60 * 60 * 2;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + accessExpiry),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/api/v1/auth',
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: refreshExpiry,
  });
};

module.exports = attachCookies;