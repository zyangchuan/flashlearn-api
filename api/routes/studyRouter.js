const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');

const {
  getStudyCard,
  getStudyCardSetProgress,
  updateCardSet
} = require('../controllers/studyController');

router.route('/:deckId')
  .get(authenticateUser, getStudyCard)
  .patch(authenticateUser, updateCardSet);

router.route('/progress/:deckId')
  .get(authenticateUser, getStudyCardSetProgress);

module.exports = router;