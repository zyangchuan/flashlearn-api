const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');

const {
  createBlitzCards
} = require('../controllers/blitzController');

router.route('/:id').get(authenticateUser, createBlitzCards);

module.exports = router;