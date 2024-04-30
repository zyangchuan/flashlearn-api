const { Deck, DeckUser } = require('../models');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const getOwnDecks = async (req, res) => {
  const deckUsers = await DeckUser.findAll({
    where: { user_id: req.user.id },
    order: [['createdAt', 'ASC']],
    include: [{
      model: Deck,
      attributes: ['id','deck_name','deck_description','public']
    }]
  });
  const decks = deckUsers
      .filter(deckUser => deckUser.Deck)
      .map(deckUser => {
        const { id, deck_name, deck_description } = deckUser.Deck;
        return { id, deck_name, deck_description };
      });

  res.status(StatusCodes.OK).json({ decks });
}

const getUserDecks = async(req,res) =>{
  const deckUsers = await DeckUser.findAll({
    where: {
      user_id: req.params.id,
      role: 'owner'
    },
    include: [{
      model: Deck,
      where: { public: true }, 
      attributes: ['id', 'deck_name', 'deck_description'] 
    }]
  });
  const decks = deckUsers
      .filter(deckUser => deckUser.Deck)
      .map(deckUser => {
        const { id, deck_name, deck_description } = deckUser.Deck;
        return { id, deck_name, deck_description };
      });

  res.status(StatusCodes.OK).json({ decks });
}

const addPublicDecks = async(req,res) =>{
  const { deck_id } = req.params
  const deck = await Deck.findOne({
    where:{
      id: deck_id
    }
  })
  if (!deck) throw new NotFoundError ('Deck does not exist');
  const DeckUserresult = await DeckUser.findOne({
    where:{
    user_id: req.user.id,
    deck_id: deck_id
    }
  })
  if (DeckUserresult){
    throw new BadRequestError('Already added')
  }

  await DeckUser.create({
    user_id: req.user.id,
    deck_id: deck_id,
    role: 'viewer'
  })

  res.status(StatusCodes.OK).json('Deck added')

} 

const sharePrivateDecks = async(req,res) =>{
  const { role, user_id } = req.body;
  const { deck_id } = req.params;
  const deck = await Deck.findOne({
    where:{
      id: deck_id
    }

  })
  if (!deck) throw new NotFoundError ('Deck does not exist');
  const deckUserResult = await DeckUser.findOne({
    user_id: user_id,
    deck_id: deck_id,
  })
  if (deckUserResult){
    deckUserResult.role = role
    res.status(StatusCodes.OK).json('role updated')
  }
  await DeckUser.create({
    user_id: user_id,
    deck_id: id,
    role: role
  })
  res.status(StatusCodes.OK).json('deck shared')

}



const getSingleDeck = async (req, res) => {
  const { id } = req.query;
  const deck = await Deck.findOne({ where: { id: id} });
  if (!deck) throw new NotFoundError(`Deck with id ${id} is not found.`);
  res.status(StatusCodes.OK).json(deck);
}

const createDeck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { deckName, deckDescription } = req.body;
  const newdeck = await Deck.create({
    deck_name: deckName,
    deck_description: deckDescription,
    author_user_id: req.user.id
  })
  await DeckUser.create({
    deck_id: newdeck.id,
    user_id: req.user.id,
    role: 'owner'
  })
  res.status(StatusCodes.CREATED).json({ msg: "Deck created." });
}

const updateDeck = async (req, res) => {
  const { id } = req.params;
  const { deckName, deckDescription } = req.body;
  
  const deck = await Deck.findOne({ where: { id: id } });
  if (!deck) throw new NotFoundError(`Deck with id ${id} is not found.`);

  if (deckName) deck.deck_name = deckName;
  if (deckDescription) deck.deck_description = deckDescription;

  await deck.save();

  res.status(StatusCodes.OK).json({ msg: 'Deck updated successfully.' });
}

const deleteDeck = async (req, res) => {
  const { id } = req.params;
  const deck = await Deck.findOne({ where: { id: id} });
  if (!deck) throw new NotFoundError(`Deck with id ${id} is not found.`);
  await deck.destroy();
  const deckusers = await DeckUser.findAll({
    where:{
      deck_id : id,
    }
  })
  await deckusers.destroy();
  res.status(StatusCodes.OK).json({ msg: 'Deck deleted successfully.' });
}

module.exports = {
  getOwnDecks,
  getUserDecks,
  addPublicDecks,
  sharePrivateDecks,
  getSingleDeck,
  createDeck,
  updateDeck,
  deleteDeck
};