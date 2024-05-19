const redis = require('../db/connectRedis');
const { Sequelize } = require('../db/sequelize');
const { BadRequestError } = require('../errors');
const { Card, Familiarity } = require('../models');

const createCardSet = async (deckId, userId, cardSetSize) => {

  const CARD_SET_EXPIRY = 1 * 60 * 60 * 24; // Card set expiry

  const cards = await Card.findAll({ 
    subQuery: false,
    where: { deck_id: deckId },
    raw: true,
    limit: cardSetSize,
    include: {
      model: Familiarity,
      attributes: []
    },
    attributes: {
      exclude: ['deck_id', 'createdAt', 'updatedAt'],
      include: [[Sequelize.col('Familiarities.familiarity'), 'familiarity'], [Sequelize.col('Familiarities.user_id'), 'user_id'], [Sequelize.col('Familiarities.updatedAt'), 'updatedAt']]
    },
  
    // Sort by familiarity first followed by update time
    order: [['familiarity', 'ASC'], ['updatedAt', 'ASC']]
  });
  
  if (!cards.length) throw new BadRequestError('deck_empty');
  
  const transaction = await redis.multi()
  cards.forEach(async card => await transaction.rpush(
    `cardSet:uncompleted:${deckId}:${userId}`, 
    JSON.stringify(card)
  ))
  
  await transaction.expire(`cardSet:uncompleted:${deckId}:${userId}`, CARD_SET_EXPIRY).exec();
}

module.exports = createCardSet;