const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const { authorizeViewer, authorizeCollaborator , authorizeOwner } = require('../middlewares/authorization');
const { cardQuestionSchema, cardAnswerSchema } = require('../utils/schemas');
const { checkSchema } = require('express-validator');

const {
  getAllCards,
  updateAllCards,
  createCard,
  updateCard,
  deleteCard,
  batchDeleteCards,
  getUserCards
} = require('../controllers/cardController');

router.route('/:deckId')
  .get(authenticateUser, authorizeViewer, getAllCards)
  .post(authenticateUser, authorizeCollaborator , checkSchema({
    question: cardQuestionSchema, answer: cardAnswerSchema
  }), createCard)
  .patch(authenticateUser, authorizeCollaborator, checkSchema({
    question: cardQuestionSchema, answer: cardAnswerSchema
  }), updateCard)
  .delete(authenticateUser, authorizeCollaborator, batchDeleteCards);

router.route('/getUserCards/:deckId')
  .get(authenticateUser,getUserCards);

router.route('/:deckId/:cardId')
  .delete(authenticateUser, authorizeCollaborator, deleteCard);

router.route('/update/:deckId')
  .patch(authenticateUser,authorizeViewer,updateAllCards);

module.exports = router;