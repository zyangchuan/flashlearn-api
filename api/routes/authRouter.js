const express = require('express');
const router = express.Router();

const {
  register,
  verifyEmail,
  login,
  logout,
  resetPassword,
  changePassword,
  changeUsername
} = require('../controllers/authController');

const authenticateUser = require('../middlewares/authentication');
const { emailSchema, usernameSchema, passwordSchema } = require('../middlewares/schemas');
const { checkSchema } = require('express-validator');

router.post('/register', checkSchema({ 
    email: emailSchema, username: usernameSchema, password: passwordSchema 
  }), register);

router.post('/login', login);

router.delete('/logout', logout);
router.post('/verify-email', verifyEmail);
router.patch('/reset-password/:email', resetPassword);

router.patch('/change-password', checkSchema({ 
  password: passwordSchema 
}), changePassword);

router.patch('/change-username', authenticateUser, checkSchema({ 
  username: usernameSchema
}), changeUsername);

module.exports = router;
