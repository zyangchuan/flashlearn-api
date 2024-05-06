const { Card, Deck, Familiarity,DeckUser } = require('../models');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { UnauthorizedError, NotFoundError } = require('../errors');
const sequelize = require('../db/sequelize');

const getAllCards = async (req, res) => {
  const deck_id = req.params.id;
  const user_id = req.user.id;

  const updatedCards = new Set(
    (await Card.findAll({ 
      where: { deck_id: deck_id }, 
      order: [['createdAt', 'ASC']], 
      attributes: ['card_id'] 
    })).map(card => card.card_id)
  );

  const existingFamiliarities = new Set(await Familiarity.findAll({
    where: {
      user_id: user_id,
      card_id: updatedCards,
    },
    attributes:['card_id']
  }));

  const newCards = [...updatedCards].filter(card => !existingFamiliarities.has(card));
  const deletedCards = [...existingFamiliarities].filter(card => !updatedCards.has(card));


  await Familiarity.bulkCreate(newCards.map(card => ({
    user_id: user_id,
    card_id: card,
  })));


  await Familiarity.destroy({
    where:{
    user_id: user_id,
    card_id: deletedCards,
    }
  });

  res.status(StatusCodes.OK).json({updatedCards: Array.from(updatedCards)});
}





const createCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { type, question, answer } = req.body;

  // Start new transaction to insert new records into Cards and Familiarities table
  const transaction = await sequelize.transaction();
  
  try {
    const newCard = await Card.create({
      type: type,
      question: question,
      answer: answer,
      deck_id: req.params.id
    }, { transaction: transaction });
  
    // Create familiarity record for the card and the user
    await Familiarity.create({
      user_id: req.user.id,
      card_id: newCard.id
    }, { transaction: transaction });
  
    await transaction.commit();

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  
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
  createCard,
  updateCard,
  deleteCard,
  batchDeleteCards
}