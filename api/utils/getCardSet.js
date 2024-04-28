const redis = require('../db/connectRedis');

const getCardSetInfo = async (deckId, userId) => {
  const uncompletedCards = await redis.lrange(`cardSet:uncompleted:${deckId}:${userId}`, 0, -1);
  const completedCards = await redis.lrange(`cardSet:completed:${deckId}:${userId}`, 0, -1);
  const cardSetSize = uncompletedCards.length + completedCards.length;

  return { uncompletedCards: uncompletedCards, completedCards: completedCards, cardSetSize: cardSetSize };
}

module.exports = getCardSetInfo;