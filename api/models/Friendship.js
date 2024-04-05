const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Friendship = sequelize.define('Friendship', {
  requestor: {
    type: DataTypes.STRING(36),
    allowNull: false,
    primaryKey: true
  },
  requestee: {
    type: DataTypes.STRING(36),
    allowNull: false,
    primaryKey: true
  },
  accepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}
);

module.exports = Friendship;