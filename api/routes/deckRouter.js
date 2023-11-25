const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const { deckNameSchema, deckDescriptionSchema } = require('../utils/schemas');
const { checkSchema } = require('express-validator');

const {
  getAllDecks,
  getSingleDeck,
  createDeck,
  updateDeck,
  deleteDeck
} = require('../controllers/deckController');

router.route('/')
  .get(authenticateUser, getAllDecks)
  .post(authenticateUser, checkSchema({ 
    deckName: deckNameSchema, deckDescription: deckDescriptionSchema 
  }), createDeck);

router.route('/:deckId')
  .get(authenticateUser, getSingleDeck)
  .patch(authenticateUser, updateDeck)
  .delete(authenticateUser, deleteDeck);

module.exports = router;