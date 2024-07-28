const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Deck = sequelize.define('Deck', {
  deck_id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  deck_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  deck_description: {
    type: DataTypes.STRING(200),
  },
  author_user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  public:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = Deck;