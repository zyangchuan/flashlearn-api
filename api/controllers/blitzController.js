
const { Card } = require('../models')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const crypto = require('crypto');
const redis = require('../db/connectRedis');

const GAME_DURATION = 1 * 60 * 60; // 1 min game duration

const createBlitzCards = async (req, res) => {
  const { id: deckId } = req.params;
  const { id: userId } = req.user;
  let blitzCards = await redis.scard(`blitzCardSet:${deckId}:${userId}`);

  if (blitzCards) {
    await redis.del(`blitzCardSet:${deckId}:${userId}`)
    await redis.del(`blitzCardAnswerSet:${deckId}:${userId}`)
  };

  const deckSize = await Card.count({ where: { deck_id: deckId } });

  if (deckSize < 20) throw new BadRequestError('deck_size_small');

  const blitzSize = Math.min(Math.ceil(deckSize * 0.6), 30);

  const cards = await Card.findAll({ 
    where: { deck_id: deckId },
    limit: blitzSize,
  });

  if (!cards.length) throw new BadRequestError('deck_empty');
  
  const transaction = await redis.multi()
  cards.forEach(async card => {
    const questionId = crypto.randomBytes(5).toString('hex');
    const answerId = crypto.randomBytes(5).toString('hex');
    await transaction.sadd(`blitzCardSet:${deckId}:${userId}`, JSON.stringify({ cardId: card.id, questionId: questionId, question: card.question, answerId: answerId, answer: card.answer }));
    
    await transaction.sadd(`blitzCardAnswerSet:${deckId}:${userId}`, `${card.id}:${questionId}:${answerId}`);
  });
  
  await transaction.expire(`blitzCardSet:${deckId}:${userId}`, GAME_DURATION + 60);
  await transaction.expire(`blitzCardAnswerSet:${deckId}:${userId}`, GAME_DURATION + 60); // 60 seconds buffer
  
  await transaction.exec();

  res.status(StatusCodes.CREATED).json({ msg: 'Blitz cards created.' });
}

module.exports = {
  createBlitzCards
}