const express = require('express');
const router = express.Router();

const {
  getUserInfo
} = require('../controllers/profileController');

router.route('/:id')
    .get(getUserInfo);

module.exports = router;