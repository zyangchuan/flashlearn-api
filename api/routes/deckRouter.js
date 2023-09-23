const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');

const {
  getAllDecks,
  getSingleDeck,
  createDeck,
  updateDeck,
  deleteDeck
} = require('../controllers/deckController');

router.get('/', authenticateUser, getAllDecks);

module.exports = router;