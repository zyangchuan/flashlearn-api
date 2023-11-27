const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING(200),
  },
  deck_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

module.exports = Card;