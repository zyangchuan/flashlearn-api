const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');

const {
  getStudyCard,
  getStudyCardSetProgress,
  updateCardSet
} = require('../controllers/studyController');

router.route('/:id')
  .get(authenticateUser, getStudyCard)
  .patch(authenticateUser, updateCardSet);

router.route('/progress/:id')
  .get(authenticateUser, getStudyCardSetProgress);

module.exports = router;