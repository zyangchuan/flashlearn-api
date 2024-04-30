const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const DeckUser = sequelize.define('DeckUser', {
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  deck_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  role: {
    type: DataTypes.STRING(36),
    allowNull: false,
  }
});

module.exports = DeckUser;