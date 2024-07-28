const redis = require('../../db/connectRedis');
const { Sequelize } = require('../../db/sequelize');
const { BadRequestError, NotFoundError } = require('../../errors');
const { Deck, Card, Familiarity } = require('../../models');

const createStudyCardSet = async (deckId, userId, cardSetSize) => {

  const deck = await Deck.findOne({ where: { deck_id: deckId } });
  if (!deck) throw new NotFoundError(`Deck with id ${deckId} does not exist.`);

  // Clear any existing card sets
  await redis.del(`studyCardSet:uncompleted:${deckId}:${userId}`);
  await redis.del(`studyCardSet:completed:${deckId}:${userId}`);

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
    `studyCardSet:uncompleted:${deckId}:${userId}`, 
    JSON.stringify(card)
  ))
  
  await transaction.expire(`studyCardSet:uncompleted:${deckId}:${userId}`, CARD_SET_EXPIRY).exec();
}

module.exports = createStudyCardSet;