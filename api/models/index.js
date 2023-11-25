const User = require('./User');
const Token = require('./Token');
const Deck = require('./Deck');
const sequelize = require('../db/sequelize');

(async () => await sequelize.authenticate())();

User.hasMany(Token, {
  foreignKey: 'user_id'
});
User.hasMany(Deck, {
  foreignKey: 'author_user_id'
});

(async () => await sequelize.sync())();

module.exports = {
  User,
  Token,
  Deck
};
