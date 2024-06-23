const { Card, Deck, Familiarity,DeckUser } = require('../models');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { UnauthorizedError, NotFoundError } = require('../errors');
const sequelize = require('../db/sequelize');

const getAllCards = async(req, res) => {
  const cards = await Card.findAll({
    where: {
      deck_id: req.params.deckId
    },
    order: [['createdAt', 'ASC']],
  })
  res.status(StatusCodes.OK).json({cards});
}

const getUserCards = async(req,res) => {
  const cards = await Familiarity.findAll({
    where: {
      user_id: req.user.id
    },
    order: [['createdAt', 'ASC']],
    attributes: ["familiarity"],
    include:{
      model: Card,
      where:{ deck_id: req.params.deckId },
      attributes: ['question','answer']

    }
  })
  res.status(StatusCodes.OK).json({cards});
}

const updateAllCards = async (req, res) => { 
  const { deckId } = req.params;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
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
    const deletedCards = [...existingFamiliarities].filter(card => !updatedCards.has(card));

    if (newCards.length > 0) {
      await Promise.all(newCards.map(async (card) => {
        await Familiarity.create({
          user_id: userId,
          card_id: card
        }, { transaction });
      }));
    }
    if (deletedCards.length > 0) {
      await Familiarity.destroy({
        where: {
          user_id: userId,
          card_id: deletedCards
        }}, { transaction })
      };



    await transaction.commit();

    res.status(StatusCodes.OK).json({ updatedCards: Array.from(updatedCards) });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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
  updateAllCards,
  createCard,
  updateCard,
  deleteCard,
  batchDeleteCards,
  getUserCards
}