const redis = require('../db/connectRedis');

const blitzEventHandler = async (io, socket, user) => {
  let timeElapsedInSeconds = 0;
  let time = '';
  let timer = null;

  let correctCount = 0;
  let mistakeCount = 0;

  socket.on('blitz:startTimer', () => {
    timer = setInterval(() => {
      timeElapsedInSeconds += 1;
      let seconds = timeElapsedInSeconds % 60;
      let minutes = Math.floor(timeElapsedInSeconds / 60) % 60;
      let hours = Math.floor(timeElapsedInSeconds / 60 / 60);

      seconds = seconds < 10 ? '0' + seconds : seconds;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      hours = hours < 10 ? '0' + hours : hours;

      time = hours + ':' + minutes + ':' + seconds;
      socket.emit('blitz:timer', time);
    }, 1000)
  })

  const getBlitzCards = async (...args) => {
    const deckId = args[0];
    const cards = await redis.srandmember(`blitzCardSet:${deckId}:${user.id}`, 4);

    let blitzGameCards = [];
    cards.forEach(card => {
      card = JSON.parse(card);
      blitzGameCards.push({ cardId: card.cardId, questionId: card.questionId, question: card.question });
      blitzGameCards.push({ cardId: card.cardId, answerId: card.answerId, answer: card.answer });
    })

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    shuffle(blitzGameCards);

    socket.emit('blitz:getBlitzCards', blitzGameCards);
  }

  const checkAnswer = async (...args) => {
    const deckId = args[0];
    const questionCard = args[1];
    const answerCard = args[2];
    const answer = questionCard.cardId + ':' + questionCard.questionId + ':' + answerCard.answerId;
    const correct = await redis.sismember(`blitzCardAnswerSet:${deckId}:${user.id}`, answer);

    socket.emit('blitz:checkAnswer', correct);

    if (correct) {
      correctCount += 1;
      await redis.srem(`blitzCardSet:${deckId}:${user.id}`, JSON.stringify({ cardId: questionCard.cardId, questionId: questionCard.questionId, question: questionCard.question, answerId: answerCard.answerId, answer: answerCard.answer }));
      await redis.srem(`blitzCardAnswerSet:${deckId}:${user.id}`, answer);

      const setSize = await redis.scard(`blitzCardSet:${deckId}:${user.id}`);
      if (!setSize) {
        await redis.del(`blitzCardSet:${deckId}:${user.id}`);
        await redis.del(`blitzCardAnswerSet:${deckId}:${user.id}`);

        clearInterval(timer);
        const accuracy = Math.round((correctCount - mistakeCount) / correctCount * 100 * 10) / 10;
        socket.emit('blitz:gameEnds', accuracy);
        socket.disconnect();
      }
    } else {
      mistakeCount += 1;
    }
  }

  socket.on('blitz:getBlitzCards', getBlitzCards);
  socket.on('blitz:checkAnswer', checkAnswer);
}

module.exports = blitzEventHandler;