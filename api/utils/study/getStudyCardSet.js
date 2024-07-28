const redis = require('../../db/connectRedis');

const getStudyCardSet = async (deckId, userId) => {
  let uncompletedCards = await redis.lrange(`studyCardSet:uncompleted:${deckId}:${userId}`, 0, -1);
  let completedCards = await redis.lrange(`studyCardSet:completed:${deckId}:${userId}`, 0, -1);

  const cardSetSize = uncompletedCards.length + completedCards.length;

  return { uncompletedCards: uncompletedCards, completedCards: completedCards, cardSetSize: cardSetSize };
}

module.exports = getStudyCardSet;