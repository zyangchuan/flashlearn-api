const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const authorizeUser = require('../middlewares/authorization');
const getCardSet = require('../middlewares/getCardSet');

const {
  getCard,
  getCardSetStatus,
  updateCardSet
} = require('../controllers/studyController');

router.route('/:id')
  .get(authenticateUser, authorizeUser, getCardSet, getCard)
  .patch(authenticateUser, authorizeUser, getCardSet, updateCardSet);

router.route('/status/:id')
  .get(authenticateUser, authorizeUser, getCardSetStatus);

module.exports = router;