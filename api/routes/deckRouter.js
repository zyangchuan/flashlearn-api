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
  toggleDeckPublic,
  checkRole,
  deletePublicDeck
} = require('../controllers/deckController');

router.route('/')
  .get(authenticateUser, getOwnDecks)
  .post(authenticateUser, checkSchema({ 
    deckName: deckNameSchema, deckDescription: deckDescriptionSchema 
  }), createDeck);

router.route('/user/:userId')
  .get(authenticateUser,getUserDecks);

router.route('/:deckId')
  .get(authenticateUser, getSingleDeck)
  .patch(authenticateUser, authorizeCollaborator, updateDeck)
  .delete(authenticateUser, authorizeOwner, deleteDeck);

router.route('/publicShare/:deckId')
  .post(authenticateUser, addPublicDeck)
  .delete(authenticateUser, deletePublicDeck);

router.route('/privateShare/:deckId')
  .patch(authenticateUser, sharePrivateDeck);

router.route('/toggleDeckPublic/:deckId')
  .patch(authenticateUser, authorizeOwner, toggleDeckPublic);

router.route('/checkRole/:deckId')
  .get(authenticateUser, checkRole)

module.exports = router;