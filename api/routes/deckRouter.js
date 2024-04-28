const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const authorizeUser = require('../middlewares/authorization');
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

router.route('/:id')
  .get(authenticateUser, getSingleDeck)
  .patch(authenticateUser, authorizeUser, updateDeck)
  .delete(authenticateUser, authorizeUser, deleteDeck);

module.exports = router;