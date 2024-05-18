const express = require('express');
const router = express.Router();

const {
  register,
  verifyEmail,
  login,
  logout,
  resetPassword,
  changePassword,
  changeUsername,
  googleSignIn,
  getUserInfo
} = require('../controllers/authController');

const authenticateUser = require('../middlewares/authentication');
const { emailSchema, usernameSchema, passwordSchema } = require('../utils/schemas');
const { checkSchema } = require('express-validator');

router.post('/register', checkSchema({ 
    email: emailSchema, username: usernameSchema, password: passwordSchema 
  }), register);

router.post('/login', login);

router.delete('/logout', logout);
router.patch('/verify-email', verifyEmail);
router.patch('/reset-password/:email', resetPassword);

router.patch('/change-password', checkSchema({ 
  password: passwordSchema 
}), changePassword);

router.patch('/change-username', authenticateUser, checkSchema({ 
  username: usernameSchema
}), changeUsername);

router.get('/google', googleSignIn);
router.get('/me', authenticateUser, getUserInfo);

module.exports = router;
