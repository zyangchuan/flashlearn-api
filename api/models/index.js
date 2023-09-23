const User = require('./User');
const Token = require('./Token');
const sequelize = require('../db/sequelize');

(async () => await sequelize.authenticate())();

User.hasMany(Token, {
  foreignKey: 'userId'
});

(async () => await sequelize.sync())();

module.exports = {
  User,
  Token
};
