const redis = require('../db/connectRedis');
const sequelize = require('../db/sequelize');
const { BadRequestError } = require('../errors');
const { Familiarity } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { createStudyCardSet, getStudyCardSet } = require('../utils')

const getStudyCard = async (req, res) => {
  const { deckId } = req.params;
  const { id: userId } = req.user;

  let { uncompletedCards, completedCards, cardSetSize } = await getStudyCardSet(deckId, userId);

  if (uncompletedCards.length === 0 && completedCards.length === cardSetSize) {
    await createStudyCardSet(deckId, userId, 20);
    ({ uncompletedCards, completedCards, cardSetSize } = await getStudyCardSet(deckId, userId));
  }

  res.status(StatusCodes.OK).json({ card: uncompletedCards[0] });
}

const getStudyCardSetProgress = async (req, res) => {
  const { deckId } = req.params;
  const { id: userId } = req.user;

  let { completedCards, cardSetSize } = await getStudyCardSet(deckId, userId);
  
  if (cardSetSize === 0) {
    await createStudyCardSet(deckId, userId, 20);
    ({ completedCards, cardSetSize } = await getStudyCardSet(deckId, userId));
  }

  res.status(StatusCodes.OK).json({ completedCardsCount: completedCards.length, cardSetSize: cardSetSize })
}

const updateCardSet = async (req, res) => {
  const { deckId } = req.params;
  const { id: userId } = req.user;
  const { familiarity } = req.body;

  const { uncompletedCards } = await getStudyCardSet(deckId, userId)
  
  const card = JSON.parse(uncompletedCards[0]);
  const transaction = await redis.multi();

  switch(familiarity) {
    case 0:
      card.familiarity -= 2
      card.familiarity = Math.max(0, card.familiarity);
      
      // if remaining card set has fewer than 4 cards, just push all the way to the back
      // otherwise push it to the 3rd position
      if (uncompletedCards.length < 4) {
        await transaction
          .lpop(`studyCardSet:uncompleted:${deckId}:${userId}`)
          .rpush(`studyCardSet:uncompleted:${deckId}:${userId}`, JSON.stringify(card))
          .exec();
      } else {
        await transaction.lpop(`studyCardSet:uncompleted:${deckId}:${userId}`);
        const toInsertBefore = await redis.lrange(`studyCardSet:uncompleted:${deckId}:${userId}`, 3, 3);
        await transaction
          .linsert(`studyCardSet:uncompleted:${deckId}:${userId}`, 'BEFORE', toInsertBefore, JSON.stringify(card))
          .exec();
      }
      break;
    
    case 1:
      card.familiarity -= 1
      card.familiarity = Math.max(0, card.familiarity);
      
      // if remaining card set has fewer than 5 cards, just push all the way to the back
      // otherwise push it to the 4th position
      if (uncompletedCards.length < 5) {
        await transaction
          .lpop(`studyCardSet:uncompleted:${deckId}:${userId}`)
          .rpush(`studyCardSet:uncompleted:${deckId}:${userId}`, JSON.stringify(card))
          .exec();
      } else {
        await transaction.lpop(`studyCardSet:uncompleted:${deckId}:${userId}`);
        const toInsertBefore = await redis.lrange(`studyCardSet:uncompleted:${deckId}:${userId}`, 4, 4);
        await transaction
          .linsert(`studyCardSet:uncompleted:${deckId}:${userId}`, 'BEFORE', toInsertBefore, JSON.stringify(card))
          .exec();
      }
      
      break;
    
    case 2:
      card.familiarity += 2
      card.familiarity = Math.min(4, card.familiarity);
      
      await transaction
        .lpop(`studyCardSet:uncompleted:${deckId}:${userId}`)
        .lpush(`studyCardSet:completed:${deckId}:${userId}`, JSON.stringify(card))
        .exec();

      if ((await redis.llen(`studyCardSet:completed:${deckId}:${userId}`) === 1)) {
        await redis.expire(`studyCardSet:completed:${deckId}:${userId}`, 1 * 60 * 60 * 24);
      }
      
      break;
    
    default:
      throw new BadRequestError('invalid_familiarity');
  }

  // Update database if the card set has no more cards
  if (!await redis.llen(`studyCardSet:uncompleted:${deckId}:${userId}`)) {
    const dbtransaction = await sequelize.transaction();
    const completedCards = await redis.lrange(`studyCardSet:completed:${deckId}:${userId}`, 0, -1);

    completedCards.forEach(async card => {
      card = JSON.parse(card);

      await Familiarity.update(
        { familiarity: card.familiarity },
        { 
          where: {
            user_id: userId,
            card_id: card.id
          },
        },
        { transaction: dbtransaction });
    });

    try {
      await dbtransaction.commit();
    } catch (error) {
      await dbtransaction.rollback();
      throw error;
    }
  }

  res.status(StatusCodes.OK).json({ card });
}

module.exports = {
  getStudyCard,
  getStudyCardSetProgress,
  updateCardSet
}