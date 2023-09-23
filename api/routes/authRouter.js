const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');

const {
  register,
  verifyEmail,
  login,
  logout,
  resetPassword,
  changePassword,
  changeUsername
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.post('/verify-email', verifyEmail);
router.patch('/reset-password/:email', resetPassword);
router.patch('/change-password', changePassword);
router.patch('/change-username', authenticateUser, changeUsername);

module.exports = router;
