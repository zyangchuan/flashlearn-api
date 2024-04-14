const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Familiarity = sequelize.define('Familiarity', {
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  card_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  familiarity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4
  }
});

module.exports = Familiarity;