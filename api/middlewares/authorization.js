const { Deck } = require('../models');
const { NotFoundError, UnauthorizedError } = require('../errors');
const { Op } = require('sequelize');

const authorizeViewer = async (req, res, next) => {
  const deck = await Deck.findOne({ where: { id: req.params.id }});
  if (!deck) throw new NotFoundError(`Deck with id ${req.params.id} is not found.`);
  const deckrecord = await DeckUser.findOne({ where:{ user_id:req.user.id,deck_id: req.params.id}})
  if (!deckrecord) throw new UnauthorizedError('Unauthorized');

  return next();
}

const authorizeCollaborator = async(req,res,next) =>{
  const deck = await Deck.findOne({ where: { id: req.params.id }});
  if (!deck) throw new NotFoundError(`Deck with id ${req.params.id} is not found.`);
  const deckrecord = await DeckUser.findOne({ where:{ user_id:req.user.id,deck_id: req.params.id, role: { [Op.or]: ['collaborator','owner']}}})
  if (!deckrecord) throw new UnauthorizedError('Unauthorized'); 

  return next();
}

const authorizeOwner = async(req,res,next) =>{
  const deck = await Deck.findOne({ where: { id: req.params.id }});
  if (!deck) throw new NotFoundError(`Deck with id ${req.params.id} is not found.`);
  const deckrecord = await DeckUser.findOne({ where:{ user_id:req.user.id,deck_id: req.params.id, role:'owner'}})
  if (!deckrecord) throw new UnauthorizedError('Unauthorized'); 

  return next();
}


module.exports = {
  authorizeViewer,
  authorizeCollaborator,
  authorizeOwner,
}
