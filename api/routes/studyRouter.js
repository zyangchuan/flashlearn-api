const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const authorizeUser = require('../middlewares/authorization');

const {
  getCardSet,
  updateCardSet
} = require('../controllers/studyController');

router.route('/:id')
  .get(authenticateUser, authorizeUser, getCardSet)
  .post(authenticateUser, authorizeUser, updateCardSet);

module.exports = router;