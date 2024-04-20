const { Sequelize } = require('../db/sequelize');
const { BadRequestError } = require('../errors');
const { Friendship, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const findFriends = async (req, res) => {
  const query = req.params.id;

  // variable name use searchResult
  const searchResult = await User.findAll({
    where: {
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('username')),
          {
            [Sequelize.Op.like]: query.toLowerCase() + '%'
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
    if (friendship.requestor === req.user.id) {
      return friendship.requestee;
    } else {
      return friendship.requestor;
    }
  });

  const friends = await User.findAll({
    where: {
      id: friendIds
    }
  });

  res.status(StatusCodes.OK).json({ friends });
};

const sendFriendRequest = async (req, res) => {
  const FriendId = req.params.id;
  Friendship.create({
    requestee: FriendId,
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

  const requestors = await User.findAll({
    where: {
      id: requestorIds
    }
  });

  res.status(StatusCodes.OK).json({ friendRequests: requestors });
};

const acceptFriendRequest = async (req, res) => {
  const requestorId = req.params.id; // variable name use requestorId

  const friendRequest = await Friendship.findOne({
    where: {
      requestor: requestorId,
      requestee: req.user.id,
      accepted: false
    }
  });

  friendRequest.accepted = true;
  const Requeststatus = await friendRequest.save();
  res.status(StatusCodes.OK).json({ msg: "Friend request accepted successfully." });

};

const declineFriendRequest = async (req, res) => {
  const requestorId = req.params.id;

  const friendRequest = await Friendship.findOne({
    where: {
      requestor: requestorId,
      requestee: req.user.id,
      accepted: false
    }
  });

  if (friendRequest) {
    await friendRequest.destroy();
    res.status(StatusCodes.OK).json({ msg: "Friend request declined successfully." });
  } else {
    throw new BadRequestError('Friend request not declined.')
  }
};

// This function just find friendship record and delete can already
const removeFriend = async (req, res) => {
  const friendId = req.params.id;
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
  findFriends,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend
};
