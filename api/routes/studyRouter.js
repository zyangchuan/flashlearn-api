const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');

const {
  getCard,
  getCardSetStatus,
  updateCardSet
} = require('../controllers/studyController');

router.route('/status/:id')
  .get(authenticateUser, getCardSetStatus);

router.route('/:id')
  .get(authenticateUser, getCard)
  .patch(authenticateUser, updateCardSet);

module.exports = router;