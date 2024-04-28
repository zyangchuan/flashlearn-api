const redis = require('../db/connectRedis');
const sequelize = require('../db/sequelize');
const { BadRequestError } = require('../errors');
const { Familiarity } = require('../models');
const { StatusCodes } = require('http-status-codes');

const CARD_SET_SIZE = 20;

const getCard = async (req, res) => {
  const { cardSet } = req;
  const topCard = JSON.parse(cardSet.uncompletedCards[0])
  res.status(StatusCodes.OK).json({ card: topCard });
}

const getCardSetStatus = async (req, res) => {
  const { cardSet } = req;
  res.status(StatusCodes.OK).json({ total: cardSet.cardSetSize, completed: cardSet.completedCards.length });
}

const updateCardSet = async (req, res) => {
  const { id } = req.params;
  const { familiarity } = req.body;
  const { cardSetSize, uncompletedCards } = req.cardSet;

  const card = JSON.parse(uncompletedCards[0]);
  const transaction = await redis.multi();

  switch(familiarity) {
    case 0:
      card.familiarity -= 2
      card.familiarity = Math.max(0, card.familiarity);
      
      // if remaining card set has fewer than 4 cards, just push all the way to the back
      // otherwise push it to the 3rd position
      if (cardSetSize < 4) {
        await transaction
          .lpop(`cardSet:uncompleted:${id}:${req.user.id}`)
          .rpush(`cardSet:uncompleted:${id}:${req.user.id}`, JSON.stringify(card))
          .exec();
      } else {
        await transaction.lpop(`cardSet:uncompleted:${id}:${req.user.id}`);
        const toInsertBefore = await redis.lrange(`cardSet:uncompleted:${id}:${req.user.id}`, 3, 3);
        await transaction
          .linsert(`cardSet:uncompleted:${id}:${req.user.id}`, 'BEFORE', toInsertBefore, JSON.stringify(card))
          .exec();
      }
      break;
    
    case 1:
      card.familiarity -= 1
      card.familiarity = Math.max(0, card.familiarity);
      
      // if remaining card set has fewer than 5 cards, just push all the way to the back
      // otherwise push it to the 4th position
      if (cardSetSize < 5) {
        await transaction
          .lpop(`cardSet:uncompleted:${id}:${req.user.id}`)
          .rpush(`cardSet:uncompleted:${id}:${req.user.id}`, JSON.stringify(card))
          .exec();
      } else {
        await transaction.lpop(`cardSet:uncompleted:${id}:${req.user.id}`);
        const toInsertBefore = await redis.lrange(`cardSet:uncompleted:${id}:${req.user.id}`, 4, 4);
        await transaction
          .linsert(`cardSet:uncompleted:${id}:${req.user.id}`, 'BEFORE', toInsertBefore, JSON.stringify(card))
          .exec();
      }
      
      break;
    
    case 2:
      card.familiarity += 2
      card.familiarity = Math.min(4, card.familiarity);
      
      await transaction
        .lpop(`cardSet:uncompleted:${id}:${req.user.id}`)
        .lpush(`cardSet:completed:${id}:${req.user.id}`, JSON.stringify(card))
        .exec();
      
      break;
    
    default:
      throw new BadRequestError('invalid_familiarity');
  }

  // Update database if the card set has no more cards
  if (!await redis.llen(`cardSet:uncompleted:${id}:${req.user.id}`)) {
    const dbtransaction = await sequelize.transaction();
    const completedCards = await redis.lrange(`cardSet:completed:${id}:${req.user.id}`, 0, -1);

    completedCards.forEach(async card => {
      card = JSON.parse(card);

      await Familiarity.update(
        { familiarity: card.familiarity },
        { 
          where: {
            user_id: req.user.id,
            card_id: card.id
          },
        },
        { transaction: dbtransaction });
    });

    try {
      await dbtransaction.commit();
      // Clear card set from redis
      await redis.del(`cardSet:completed:${id}:${req.user.id}`);
    } catch (error) {
      await dbtransaction.rollback();
      throw error;
    }
  }

  res.status(StatusCodes.OK).json({ card });
}

module.exports = {
  getCard,
  getCardSetStatus,
  updateCardSet
}