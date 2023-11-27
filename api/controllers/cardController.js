const Card = require('../models/Card');
const Deck = require('../models/Deck');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { UnauthorizedError, NotFoundError } = require('../errors');

const getAllCards = async (req, res) => {
  const { author_user_id } = await Deck.findOne({ where: { id: req.params.id }});
  if (req.user.id !== author_user_id) throw new UnauthorizedError('Unauthorized');

  const cards = await Card.findAll({ where: { deck_id: req.params.id } });
  res.status(StatusCodes.OK).json({ cards });
}

const createCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { author_user_id } = await Deck.findOne({ where: { id: req.params.id }});
  if (req.user.id !== author_user_id) throw new UnauthorizedError('Unauthorized');

  const { type, question, answer } = req.body;
  await Card.create({
    type: type,
    question: question,
    answer: answer,
    deck_id: req.params.id
  })
  res.status(StatusCodes.CREATED).json({ msg: "Deck created." });
}

const updateCard = async (req, res) => {
  const { id, question, answer } = req.body;

  const { author_user_id } = await Deck.findOne({ where: { id: req.params.id }});
  if (req.user.id !== author_user_id) throw new UnauthorizedError('Unauthorized');

  const card = await Card.findOne({ where: { id: id } });
  if (!card) throw new NotFoundError(`Card with id ${id} is not found.`);

  card.question = question;
  card.answer = answer;
  await card.save();

  res.status(StatusCodes.OK).json({ msg: 'Card updated successfully', card: card });
}

const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  const { author_user_id } = await Deck.findOne({ where: { id: req.params.id }});
  if (req.user.id !== author_user_id) throw new UnauthorizedError('Unauthorized');

  const card = await Card.findOne({ where: { id: cardId } });
  if (!card) throw new NotFoundError(`Card with id ${cardId} is not found.`);

  await card.destroy();

  res.status(StatusCodes.OK).json({ msg: 'Card deleted successfully' });
}

module.exports = {
  getAllCards,
  createCard,
  updateCard,
  deleteCard
}