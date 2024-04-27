const { Sequelize } = require('../db/sequelize');
const { NotFoundError } = require('../errors'); 
const { Friendship, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const searchUsers = async (req, res) => {
  const username = req.query.username;

  const searchResult = await User.findAll({
    where: {
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('username')),
          {
            [Sequelize.Op.like]: username.toLowerCase() + '%'
          }
        ),
        Sequelize.where(
          Sequelize.col('username'),
          {
            [Sequelize.Op.ne]: req.user.username
          }
        )
      ]
    }
  });

  res.status(StatusCodes.OK).json({ users: searchResult });
};

const getFriends = async (req, res) => {
  const requestorFriendships = await Friendship.findAll({
    where: {
      requestor: req.user.id,
      accepted: true
    },
    attributes: ['requestee', 'requestor']
  });

  const requesteeFriendships = await Friendship.findAll({
    where: {
      requestee: req.user.id,
      accepted: true
    },
    attributes: ['requestee', 'requestor']
  });

  const allFriendships = [...requestorFriendships, ...requesteeFriendships];

  const friendIds = allFriendships.map(friendship => {
    return friendship.requestor === req.user.id ? friendship.requestee : friendship.requestor;
  });

  const friends = await User.findAll({
    where: {
      id: friendIds,
    },
    attributes: ['username', 'pfp']
  });

  res.status(StatusCodes.OK).json({ friends });
};

const sendFriendRequest = async (req, res) => {
  const friendId = req.params.id;
  const user = await User.findOne({ where: { id: friendId } });
  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  await Friendship.create({
    requestee: friendId,
    requestor: req.user.id,
    accepted: false
  });

  res.status(StatusCodes.CREATED).json({ msg: "Friend request sent." });
};

const getFriendRequests = async (req, res) => {
  const friendRequests = await Friendship.findAll({
    where: {
      requestee: req.user.id,
      accepted: false
    }
  });

  const requestorIds = friendRequests.map(friendRequest => friendRequest.requestor);
  const requestors = await User.findAll({ where: { id: requestorIds } });

  res.status(StatusCodes.OK).json({ friendRequests: requestors });
};

const acceptFriendRequest = async (req, res) => {
  const requestorId = req.params.id;
  const user = await User.findOne({ where: { id: requestorId } });
  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  const friendRequest = await Friendship.findOne({
    where: {
      requestor: requestorId,
      requestee: req.user.id,
      accepted: false
    }
  });

  if (!friendRequest) {
    throw new NotFoundError('Friend request does not exist.');
  }

  friendRequest.accepted = true;
  await friendRequest.save(); 
  res.status(StatusCodes.OK).json({ msg: "Friend request accepted successfully." });
};

const declineFriendRequest = async (req, res) => {
  const requestorId = req.params.id;

  const friendRequest = await Friendship.findOne({
    where: {
      requestor: requestorId,
      requestee: req.user.id,
      accepted: false
    },
  });

  if (!friendRequest) {
    throw new NotFoundError('Friend request does not exist.');
  }
  await friendRequest.destroy();
  res.status(StatusCodes.OK).json({ msg: "Friend request declined successfully." });
};

const removeFriend = async (req, res) => {
  const friendId = req.params.id;
  const user = await User.findOne({ where: { id: friendId } });
  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  await Friendship.destroy({
    where: {
      [Op.or]: [
        { requestor: req.user.id, requestee: friendId },
        { requestor: friendId, requestee: req.user.id }
      ]
    }
  });

  res.status(StatusCodes.OK).json({ msg: "Friend removed successfully." });
};

module.exports = {
  getFriends,
  searchUsers,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend
};
