const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Token = sequelize.define('Token', {
  refresh_token: {
    type: DataTypes.CHAR(80),
    allowNull: false,
    primaryKey: true
  },
  ip: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  user_agent: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  expiry: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('(NOW() + INTERVAL 7 DAY)')
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

module.exports = Token;