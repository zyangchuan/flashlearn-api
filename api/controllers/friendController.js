const { Sequelize } = require('../db/sequelize');
const { BadRequestError, NotFoundError } = require('../errors');
const notFound = require('../middlewares/not-found');
const { Friendship, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const findFriends = async (req, res) => {
    const query = req.params.id;
    const friendsFinder = await User.findAll({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('username')),
        {
          [Sequelize.Op.like]: query.toLowerCase() + '%'
        }
      )
    });
  
    if (friendsFinder.length > 0) {
      res.status(StatusCodes.OK).json({ users: friendsFinder });
    } else {
      throw new NotFoundError('No user found');
    }
  };
  

const getFriends = async (req, res) => {
  const requestorFriendships = await Friendship.findAll({
    where: {
      requestor: req.user.id,
      accepted: true
    }
  });

  const requesteeFriendships = await Friendship.findAll({
    where: {
      requestee: req.user.id,
      accepted: true
    }
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

const addFriend = async (req, res) => {
  const  FriendId  = req.params.id;
  Friendship.create({
    requestee: req.user.id,
    requestor: FriendId,
    accepted: false
  })
  res.status(StatusCodes.CREATED).json({ msg: "Friendship created." });

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
  const friendId = req.params.id;

  const friendRequest = await Friendship.findOne({
    where: {
      requestor: friendId,
      requestee: req.user.id,
      accepted: false
    }
  });

  if (friendRequest) {
    await friendRequest.update({
      accepted: true
    });

    res.status(StatusCodes.OK).json({ msg: "Friend request accepted successfully." });
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ error: "Friend request not found or already accepted." });
  }
};

const declineFriendRequest = async (req, res) => {
  const friendId = req.params.id;

  const friendRequest = await Friendship.findOne({
    where: {
      requestor: friendId,
      requestee: req.user.id,
      accepted: false
    }
  });

  if (friendRequest) {
    await friendRequest.destroy();
    res.status(StatusCodes.OK).json({ msg: "Friend request declined successfully." });
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ error: "Friend request not found or already accepted." });
  }
};

const removeFriend = async (req, res) => {
  const friendId = req.params.id;

  const currentUser = await User.findOne({ where: { id: req.user.id } });
  const friendUser = await User.findOne({ where: { id: friendId } });

  if (!currentUser || !friendUser) {
    res.status(StatusCodes.NOT_FOUND).json({ error: "One or both users not found." });
    return;
  }

  const deletedFriendshipCount = await Friendship.destroy({
    where: {
      [Op.or]: [
        { requestor: currentUser.id, requestee: friendUser.id },
        { requestor: friendUser.id, requestee: currentUser.id }
      ]
    }
  });

  if (deletedFriendshipCount > 0) {
    res.status(StatusCodes.OK).json({ msg: "Friend removed successfully." });
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ error: "Friendship not found." });
  }
};

module.exports = {
  getFriends,
  findFriends,
  addFriend,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend
};
