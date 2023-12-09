const User = require('./User');
const Token = require('./Token');
const Deck = require('./Deck');
const Card = require('./Card');
const sequelize = require('../db/sequelize');

(async () => await sequelize.authenticate())();

User.hasMany(Token, {
  foreignKey: 'user_id'
});
User.hasMany(Deck, {
  foreignKey: 'author_user_id'
});
Deck.hasMany(Card, {
  foreignKey: 'deck_id'
});

(async () => await sequelize.sync({ alte: true }))();

module.exports = {
  User,
  Token,
  Deck,
  Card
};
