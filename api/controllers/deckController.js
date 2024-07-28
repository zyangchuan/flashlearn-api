const { Deck, DeckUser } = require('../models');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const sequelize = require('../db/sequelize');

const getOwnDecks = async (req, res) => {
  const decks = await DeckUser.findAll({
    where: { user_id: req.user.id },
    order: [['createdAt', 'ASC']],
    include: {
    model: Deck,
    attributes: []
  },
  attributes: {
    include: [
      [sequelize.Sequelize.col('Deck.deck_name'), 'deck_name'],
      [sequelize.Sequelize.col('Deck.deck_description'), 'deck_description'],
      [sequelize.Sequelize.col('Deck.public'), 'public']
      ]
  },
  });
  
  res.status(StatusCodes.OK).json({ decks });
  }

const getUserDecks = async(req,res) =>{
  const decks = await DeckUser.findAll({
    where: {
      user_id: req.params.userId,
      role: 'owner',
    },
    include: {
      model: Deck,
      attributes: [],
      where:{
        public : true
      }
    },
    attributes: {
      include: [
        [sequelize.Sequelize.col('Deck.deck_name'), 'deck_name'],
        [sequelize.Sequelize.col('Deck.deck_description'), 'deck_description'],
        [sequelize.Sequelize.col('Deck.public'), 'public']
        ]
    }
  })

  res.status(StatusCodes.OK).json({ decks });
}

const addPublicDeck = async(req,res) =>{
  const { deckId } = req.params
  const deck = await Deck.findOne({
    where:{
      id: deckId
    }
  })
  if (!deck) throw new NotFoundError ('Deck does not exist');
  const deckUserResult = await DeckUser.findOne({
    where:{ user_id: req.user.id, deck_id: deckId }
  })
  if (deckUserResult){
    throw new BadRequestError('Already added')
  }

  await DeckUser.create({
    user_id: req.user.id,
    deck_id: deckId,
    role: 'viewer'
  })

  res.status(StatusCodes.OK).json('Deck added')

} 

const sharePrivateDeck = async(req,res) =>{
  const { role, userId } = req.body, { deckId } = req.params;
  if (!['collaborator', 'viewer'].includes(role)) throw new BadRequestError('Role must be either "collaborator" or "viewer"');
  const deck = await Deck.findOne({
    where:{
      id: deckId
    }

  })
  if (!deck) throw new NotFoundError ('Deck does not exist');
  const deckUserResult = await DeckUser.findOne({
    user_id: userId,
    deck_id: deckId,
  })
  if (deckUserResult){
    deckUserResult.role = role
    await deckUserResult.save()
    res.status(StatusCodes.OK).json('role updated')
  }
  await DeckUser.create({
    user_id: userId,
    deck_id: deckId,
    role: role
  })
  res.status(StatusCodes.OK).json('deck shared')

}



const getSingleDeck = async (req, res) => {
  const { deckId } = req.params;
  const deck = await Deck.findOne({ where: { id: deckId} });
  if (!deck) throw new NotFoundError(`Deck with id ${deckId} is not found.`);
  res.status(StatusCodes.OK).json(deck);
}

const createDeck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { deckName, deckDescription } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const newDeck = await Deck.create({
      deck_name: deckName,
      deck_description: deckDescription,
      author_user_id: req.user.id
    },{ transaction })
    await DeckUser.create({
      deck_id: newDeck.id,
      user_id: req.user.id,
      role: 'owner'
    },{ transaction })
    await transaction.commit()

    res.status(StatusCodes.CREATED).json({ msg: "Deck created." });
  } catch (error){
    await transaction.rollback();
    throw error;
  }
 
  
  
}

const updateDeck = async (req, res) => {
  const { deckId } = req.params;
  const { deckName, deckDescription } = req.body;
  
  const deck = await Deck.findOne({ where: { id: deckId } });
  if (!deck) throw new NotFoundError(`Deck with id ${deckId} is not found.`);

  if (deckName) deck.deck_name = deckName;
  if (deckDescription) deck.deck_description = deckDescription;

  await deck.save();

  res.status(StatusCodes.OK).json({ msg: 'Deck updated successfully.' });
}

const deleteDeck = async (req, res) => {
  const { deckId } = req.params;
  const deck = await Deck.findOne({ where: { id: deckId} });
  if (!deck) throw new NotFoundError(`Deck with id ${deckId} is not found.`);
  await deck.destroy();
  const deckUserResult = await DeckUser.findAll({
    where:{
      deck_id : deckId,
    }
  })
  await deckUserResult.destroy();
  res.status(StatusCodes.OK).json({ msg: 'Deck deleted successfully.' });
}

const toggleDeckPublic = async(req,res) =>{
  console.log(req.params.deckId);
  const deck = await Deck.findOne({
    where:{
      id: req.params.deckId
    }
  })
  if (!deck) throw new NotFoundError(`Deck with id ${req.params.deckId} is not found.`);

  deck.public = !deck.public;
  await deck.save();

  res.status(StatusCodes.OK).json({ msg: 'Deck toggled.' });
}

module.exports = {
  getOwnDecks,
  getUserDecks,
  addPublicDeck,
  sharePrivateDeck,
  getSingleDeck,
  createDeck,
  updateDeck,
  deleteDeck,
  toggleDeckPublic
};