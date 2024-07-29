const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const { authorizeViewer, authorizeCollaborator , authorizeOwner } = require('../middlewares/authorization');
const { cardQuestionSchema, cardAnswerSchema } = require('../utils/schemas');
const { checkSchema } = require('express-validator');

const {
  getAllCards,
  createCard,
  updateCard,
  deleteCard,
  batchDeleteCards
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

router.route('/:deckId/:cardId')
  .delete(authenticateUser, authorizeCollaborator, deleteCard);

module.exports = router;