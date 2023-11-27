const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const { cardQuestionSchema, cardAnswerSchema } = require('../utils/schemas');
const { checkSchema } = require('express-validator');

const {
  getAllCards,
  createCard,
  updateCard,
  deleteCard
} = require('../controllers/cardController');

router.route('/:id')
  .get(authenticateUser, getAllCards)
  .post(authenticateUser, checkSchema({
    question: cardQuestionSchema, answer: cardAnswerSchema
  }), createCard)
  .patch(authenticateUser, checkSchema({
    question: cardQuestionSchema, answer: cardAnswerSchema
  }), updateCard)

router.route('/:id/:cardId').delete(authenticateUser, deleteCard);

module.exports = router;