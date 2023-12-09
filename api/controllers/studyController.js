const redis = require('../db/connectRedis');
const { BadRequestError } = require('../errors');
const { Card, Deck } = require('../models');
const { StatusCodes } = require('http-status-codes');

const getCardSet = async (req, res) => {
  const { id } = req.params;
  const data = await redis.keys(`cardSet:uncompleted:${id}:${req.user.id}`);

  if (!data.length) {
    const cards = await Card.findAll({ 
      where: { deck_id: req.params.id }, 
      raw: true, 
      limit: 5,
      order: [['difficulty', 'DESC']]
    });
    if (!cards.length) throw new BadRequestError('There is no cards in the deck');

    const transaction = await redis.multi()
    cards.forEach(async card => await transaction.rpush(
      `cardSet:uncompleted:${id}:${req.user.id}`, 
      JSON.stringify(card), 
    ))
    // Card set expires after 1 day
    await transaction.expire(`cardSet:uncompleted:${id}:${req.user.id}`, 1 * 60 * 60 * 24).exec();

    res.status(StatusCodes.OK).json({ cards });
  } else {
    const data = await redis.lrange(`cardSet:uncompleted:${id}:${req.user.id}`, 0, -1);
    const cards = [];
    data.forEach(card => {
      cards.push(JSON.parse(card));
    });
    res.status(StatusCodes.OK).json({ cards });
  }
}

const updateCardSet = async (req, res) => {
  const { id } = req.params;
  const { difficulty } = req.body;
  if (!(await redis.llen(`cardSet:uncompleted:${id}:${req.user.id}`))) throw new BadRequestError('cardset_empty');

  const card = JSON.parse(await redis.lrange(`cardSet:uncompleted:${id}:${req.user.id}`, 0, 0));

  switch(difficulty) {
    case 0:
      card.difficulty -= 2
      card.difficulty = Math.max(0, card.difficulty);
      await redis.multi()
        .lpop(`cardSet:uncompleted:${id}:${req.user.id}`)
        .lpush(`cardSet:completed:${id}:${req.user.id}`, JSON.stringify(card))
        .exec();
      break;
    
    case 1:
      card.difficulty -= 1
      card.difficulty = Math.max(0, card.difficulty);
      const transaction = await redis.multi();
      
      if (await redis.llen(`cardSet:uncompleted:${id}:${req.user.id}`) < 5) {
        await transaction
          .lpop(`cardSet:uncompleted:${id}:${req.user.id}`)
          .rpush(`cardSet:uncompleted:${id}:${req.user.id}`, JSON.stringify(card))
          .exec();
      } else {
        await transaction.lpop(`cardSet:uncompleted:${id}:${req.user.id}`);
        const toInsertBefore = await redis.lrange(`cardSet:uncompleted:${id}:${req.user.id}`, 4, 4);
        console.log(toInsertBefore)
        await transaction.linsert(`cardSet:uncompleted:${id}:${req.user.id}`, 'BEFORE', toInsertBefore, JSON.stringify(card));
        await transaction.exec();
      }
      break;
    
    case 2:
      card.difficulty += 2
      card.difficulty = Math.min(4, card.difficulty);
      
      await redis.multi()
        .lpop(`cardSet:uncompleted:${id}:${req.user.id}`)
        .rpush(`cardSet:uncompleted:${id}:${req.user.id}`, JSON.stringify(card))
        .exec();
      break;
    
    default:
      throw new BadRequestError('invalid_difficulty');
  }

  res.status(StatusCodes.OK).json({ card });

}

module.exports = {
  getCardSet,
  updateCardSet
}