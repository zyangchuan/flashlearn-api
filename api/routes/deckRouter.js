const express = require('express');
const router = express.Router();

const authenticateUser = require('../middlewares/authentication');
const { authorizeViewer, authorizeCollaborator , authorizeOwner } = require('../middlewares/authorization');
const { deckNameSchema, deckDescriptionSchema } = require('../utils/schemas');
const { checkSchema } = require('express-validator');


const {
  getOwnDecks,
  addPublicDeck,
  sharePrivateDeck,
  getUserDecks,
  getSingleDeck,
  createDeck,
  updateDeck,
  deleteDeck,
  toggleDeckPublic
} = require('../controllers/deckController');

router.route('/')
  .get(authenticateUser, getOwnDecks)
  .post(authenticateUser, checkSchema({ 
    deckName: deckNameSchema, deckDescription: deckDescriptionSchema 
  }), createDeck);

router.route('/user/:userId')
  .get(authenticateUser,getUserDecks);

router.route('/:deckId')
  .get(authenticateUser, authorizeViewer, getSingleDeck)
  .patch(authenticateUser, authorizeCollaborator, updateDeck)
  .delete(authenticateUser, authorizeOwner, deleteDeck);

router.route('/publicShare/:deckId')
  .post(authenticateUser,addPublicDeck);

router.route('/privateShare/:deckId')
  .patch(authenticateUser,sharePrivateDeck);

router.route('/toggleDeckPublic/:deckId')
  .post(authenticateUser,authorizeOwner,toggleDeckPublic);

module.exports = router;