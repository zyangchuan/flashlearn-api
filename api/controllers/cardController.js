const { Card, Familiarity } = require('../models');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');

const getAllCards = async (req, res) => {
  const cards = await Card.findAll({
    where: {
      deck_id: req.params.deckId
    },
    order: [['createdAt', 'ASC']],
  });

  res.status(StatusCodes.OK).json({ cards });
}

const updateFamiliarityData = async (req, res) => { 
  const { deckId } = req.params;
  const userId = req.user.id;

  const updatedCards = new Set(
    (await Card.findAll({
      where: { deck_id: deckId },
      attributes: ['id'],
    })).map(card => card.id)
  );

  const existingFamiliarities = new Set(
    (await Familiarity.findAll({
      include: [{
        model: Card,
        where: { deck_id: deckId },
        attributes: [] 
      }],
      where: { user_id: userId },
      attributes: ['card_id'],
    })).map(familarity => familarity.card_id)
  );

  const newCards = [...updatedCards].filter(card => !existingFamiliarities.has(card));

  if (newCards.length > 0) {
    const familiarityData = newCards.map(card => ({
      user_id: userId,
      card_id: card
    }));
  
    await Familiarity.bulkCreate(familiarityData);
  }
  
  res.status(StatusCodes.OK).json({ msg: 'Familiarity data updated' });
};

const createCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { type, question, answer } = req.body;

  await Card.create({
    type: type,
    question: question,
    answer: answer,
    deck_id: req.params.deckId
  });

  res.status(StatusCodes.CREATED).json({ msg: "Card created." });
}

const updateCard = async (req, res) => {
  const { id, question, answer } = req.body;

  const card = await Card.findOne({ where: { id: id } });
  if (!card) throw new NotFoundError(`Card with id ${id} is not found.`);

  card.question = question;
  card.answer = answer;
  await card.save();

  res.status(StatusCodes.OK).json({ msg: 'Card updated successfully', card: card });
}

const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  const card = await Card.findOne({ where: { id: cardId } });
  if (!card) throw new NotFoundError(`Card with id ${cardId} is not found.`);

  await card.destroy();

  res.status(StatusCodes.OK).json({ msg: 'Card deleted successfully' });
}

const batchDeleteCards = async (req, res) => {
  const { cards } = req.body;
  await Card.destroy({ where: { id: cards } });

  res.status(StatusCodes.OK).json({ msg: 'Card deleted successfully' });
}

module.exports = {
  getAllCards,
  updateFamiliarityData,
  createCard,
  updateCard,
  deleteCard,
  batchDeleteCards
}