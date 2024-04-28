const { Deck } = require('../models');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllDecks = async (req, res) => {
  const decks = await Deck.findAll({ where: { author_user_id: req.user.id }, order: [['createdAt', 'ASC']] });
  res.status(StatusCodes.OK).json({ decks });
}

const getSingleDeck = async (req, res) => {
  const { id } = req.params;
  const deck = await Deck.findOne({ where: { id: id, author_user_id: req.user.id } });
  if (!deck) throw new NotFoundError(`Deck with id ${id} is not found.`);
  res.status(StatusCodes.OK).json(deck);
}

const createDeck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { deckName, deckDescription } = req.body;
  await Deck.create({
    deck_name: deckName,
    deck_description: deckDescription,
    author_user_id: req.user.id
  })
  res.status(StatusCodes.CREATED).json({ msg: "Deck created." });
}

const updateDeck = async (req, res) => {
  const { id } = req.params;
  const { deckName, deckDescription } = req.body;
  
  const deck = await Deck.findOne({ where: { id: id, author_user_id: req.user.id } });
  if (!deck) throw new NotFoundError(`Deck with id ${id} is not found.`);

  if (deckName) deck.deck_name = deckName;
  if (deckDescription) deck.deck_description = deckDescription;

  await deck.save();

  res.status(StatusCodes.OK).json({ msg: 'Deck updated successfully.' });
}

const deleteDeck = async (req, res) => {
  const { id } = req.params;
  const deck = await Deck.findOne({ where: { id: id, author_user_id: req.user.id } });
  if (!deck) throw new NotFoundError(`Deck with id ${id} is not found.`);
  await deck.destroy();
  res.status(StatusCodes.OK).json({ msg: 'Deck deleted successfully.' });
}

module.exports = {
  getAllDecks,
  getSingleDeck,
  createDeck,
  updateDeck,
  deleteDeck
}