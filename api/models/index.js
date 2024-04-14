const User = require('./User');
const Token = require('./Token');
const Deck = require('./Deck');
const Card = require('./Card');
const Friendship = require('./Friendship')
const Familiarity = require('./Familiarity');
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
User.hasMany(Familiarity, {
  foreignKey: 'user_id'
});
Card.hasMany(Familiarity, {
  foreignKey: 'card_id'
});


(async () => await sequelize.sync({ alter: true }))();

module.exports = {
  User,
  Token,
  Deck,
  Card,
  Friendship,
  Familiarity
};
