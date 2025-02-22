const { NotFoundError, BadRequestError } = require('../errors'); 
const { User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { Sequelize } = require('sequelize');

const getUserInfo = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ 
    where: { id: userId }, 
    attributes: ['id', 'email', 'username', 'picture', 'createdAt'],
    raw: true
  });

  if (!user) throw NotFoundError('User is not found');

  res.status(StatusCodes.OK).json({ user });
}

module.exports = {
  getUserInfo
};
