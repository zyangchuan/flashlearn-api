const redis = require('../db/connectRedis');
const { createCardSet, getCardSetInfo } = require('../utils');

const getCardSet = async (req, res, next) => {
  const { id } = req.params;
  
  const uncompletedSize = await redis.llen(`cardSet:uncompleted:${id}:${req.user.id}`);
  if (!uncompletedSize) {
    await createCardSet(id, req.user.id, 20);
    // Clear card set from redis
    await redis.del(`cardSet:completed:${id}:${req.user.id}`);
  }

  req.cardSet = await getCardSetInfo(req.user.id, id);

  return next();
}

module.exports = getCardSet;