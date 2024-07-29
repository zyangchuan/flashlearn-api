const { Card, Familiarity } = require('../../models');

const updateFamiliarityData = async (deckId, userId) => { 

  const updatedCards = new Set(
    (await Card.findAll({
      where: { deck_id: deckId },
      attributes: ['id'],
    })).map(card => card.id)
  );

  const existingFamiliarities = new Set(
    (await Familiarity.findAll({
      include: [{
        model: Card,
        where: { deck_id: deckId },
        attributes: [] 
      }],
      where: { user_id: userId },
      attributes: ['card_id'],
    })).map(familarity => familarity.card_id)
  );

  const newCards = [...updatedCards].filter(card => !existingFamiliarities.has(card));

  if (newCards.length > 0) {
    const familiarityData = newCards.map(card => ({
      user_id: userId,
      card_id: card
    }));
  
    await Familiarity.bulkCreate(familiarityData);
  }
};

module.exports = updateFamiliarityData;