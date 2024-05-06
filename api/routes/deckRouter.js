const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const { authorizeViewer, authorizeCollaborator , authorizeOwner } = require('../middlewares/authorization');
const { deckNameSchema, deckDescriptionSchema } = require('../utils/schemas');
const { checkSchema } = require('express-validator');


const {
  getOwnDecks,
  addPublicDecks,
  sharePrivateDecks,
  getUserDecks,
  getSingleDeck,
  createDeck,
  updateDeck,
  deleteDeck
} = require('../controllers/deckController');

router.route('/')
  .get(authenticateUser, getOwnDecks)
  .post(authenticateUser, checkSchema({ 
    deckName: deckNameSchema, deckDescription: deckDescriptionSchema 
  }), createDeck);

router.route('/user/:id')
  .get(authenticateUser,getUserDecks);

router.route('/:id')
  .get(authenticateUser, authorizeViewer, getSingleDeck)
  .patch(authenticateUser, authorizeCollaborator, updateDeck)
  .delete(authenticateUser, authorizeOwner, deleteDeck);

router.route('/publicShare/:deck_id')
  .post(authenticateUser,addPublicDecks);

router.route('/privateShare/:deck_id')
  .patch(authenticateUser,sharePrivateDecks);

module.exports = router;