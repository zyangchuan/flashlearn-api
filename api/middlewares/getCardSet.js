const redis = require('../db/connectRedis');
const { createCardSet } = require('../utils');

const getCardSet = async (req, res, next) => {
  const { id } = req.params;
  
  const uncompletedSize = await redis.llen(`cardSet:uncompleted:${id}:${req.user.id}`);
  if (!uncompletedSize) await createCardSet(id, req.user.id, 20);

  const uncompletedCards = await redis.lrange(`cardSet:uncompleted:${id}:${req.user.id}`, 0, -1);
  const completedCards = await redis.lrange(`cardSet:completed:${id}:${req.user.id}`, 0, -1);
  
  const total = uncompletedCards.length + completedCards.length;
  req.cardSet = { uncompletedCards: uncompletedCards, completedCards: completedCards, cardSetSize: total };

  return next();
}

module.exports = getCardSet;