const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const authorizeUser = require('../middlewares/authorization');
const { cardQuestionSchema, cardAnswerSchema } = require('../utils/schemas');
const { checkSchema } = require('express-validator');

const {
  getAllCards,
  createCard,
  updateCard,
  deleteCard,
  batchDeleteCards
} = require('../controllers/cardController');

router.route('/:id')
  .get(authenticateUser, authorizeUser, getAllCards)
  .post(authenticateUser, authorizeUser, checkSchema({
    question: cardQuestionSchema, answer: cardAnswerSchema
  }), createCard)
  .patch(authenticateUser, authorizeUser, checkSchema({
    question: cardQuestionSchema, answer: cardAnswerSchema
  }), updateCard)
  .delete(authenticateUser, authorizeUser, batchDeleteCards);

router.route('/:id/:cardId').delete(authenticateUser, authorizeUser, deleteCard);

module.exports = router;