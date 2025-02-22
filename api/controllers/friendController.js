const { NotFoundError, BadRequestError } = require('../errors'); 
const { Friendship, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { Sequelize } = require('sequelize');

const findFriends = async (req, res) => {
  const query = req.query.username;
  let searchResult = []

  if (query.length) {
    searchResult = await User.findAll({
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('username')), 
            { [Sequelize.Op.like]: '%' + query.toLowerCase() + '%' }
          ),
          Sequelize.where(
            Sequelize.col('username'),
            { [Sequelize.Op.ne]: req.user.username }
          )
        ],
      },
      attributes: ['id', 'email', 'username', 'picture'],
      raw: true
    });
  }

  searchResult = await Promise.all(searchResult.map(async (result) => {
    result.status = 'not_friend'
    const friendsResult = await Friendship.findOne({
      where: {
        [Sequelize.Op.or]: [
          { requestor: req.user.id, requestee: result.id },
          { requestor: result.id , requestee: req.user.id }
        ]
      },
      raw: true
    });
    
    if (friendsResult) {
      if (friendsResult.accepted) {
        result.status = 'friend';
      } else { 
        if (friendsResult.requestor === req.user.id) {
          result.status = 'requested';
        } else {
          result.status = 'to_respond';
        }
      }
    }
    return result;
  }))

  res.status(StatusCodes.OK).json({ users: searchResult });
};

const getFriends = async (req, res) => {
  const requestorId = req.user.id
  const requestorFriendships = await Friendship.findAll({
    where: {
      requestor: requestorId,
      accepted: true
    },
    attributes: ['requestee', 'requestor']
  });

  const requesteeFriendships = await Friendship.findAll({
    where: {
      requestee: requestorId,
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
    where: { id: friendIds },
    attributes: ['id', 'email', 'username', 'picture']
  });

  res.status(StatusCodes.OK).json({ friends });
};

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.params
  if (friendId == req.user.id) throw new BadRequestError('Invalid Request.');

  const user = await User.findOne({ where: { id: friendId } });
  if (!user) throw new NotFoundError('User does not exist');

  const request = await Friendship.findOne({
    where: {
      requestor: req.user.id,
      requestee: friendId 
    }
  })
  if (request) throw new BadRequestError('Request has already been sent.');

  await Friendship.create({
    requestee: friendId,
    requestor: req.user.id,
    accepted: false
  });

  res.status(StatusCodes.CREATED).json({ msg: "Friend request sent." });
};

const getFriendRequests = async (req, res) => {
  const requestors = await Friendship.findAll({
    where: {
      requestee: req.user.id,
      accepted: false
    }
  });

  const requestorIds = requestors.map(friendRequest => friendRequest.requestor);

  const friendRequests = await User.findAll({
    where: { id: requestorIds },
    attributes: ['id', 'email', 'username']
  });

  res.status(StatusCodes.OK).json({ friendRequests });
};

const acceptFriendRequest = async (req, res) => {
  const { requestorId } = req.params;
  const user = await User.findOne({ where: { id: requestorId } });

  if (!user) throw new NotFoundError('User does not exist');

  const friendRequest = await Friendship.findOne({
    where: {
      requestor: requestorId,
      requestee: req.user.id,
      accepted: false
    }
  });

  if (!friendRequest) throw new NotFoundError('Relationship does not exist');

  friendRequest.accepted = true;
  await friendRequest.save();
  
  res.status(StatusCodes.OK).json({ msg: "Friend request accepted successfully." });
};

const declineFriendRequest = async (req, res) => {
  const { requestorId } = req.params;

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
  const { friendId }= req.params;
  const friend = await Friendship.findOne({
    where: {
      [Sequelize.Op.or]: [
        { requestor: req.user.id, requestee: friendId },
        { requestor: friendId, requestee: req.user.id }
      ]
    }
  });
  if (!friend) throw new NotFoundError('Relationship does not exist');
  await friend.destroy();

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
