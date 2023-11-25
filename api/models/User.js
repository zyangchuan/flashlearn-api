const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(80),
  },
  verification_token: {
    type: DataTypes.CHAR(80),
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  password_token: {
    type: DataTypes.CHAR(80),
    defaultValue: null
  },
  password_token_expiry: {
    type: DataTypes.CHAR(80),
    defaultValue: null
  }
});

module.exports = User;