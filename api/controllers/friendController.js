const { Sequelize } = require('../db/sequelize');
const { BadRequestError } = require('../errors'); // import NotFoundError and delete BadRequestError
const { Friendship, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

// searchUsers for the controller name cuz its not clear if its searching among the list of friends or searching users
const findFriends = async (req, res) => {

  // use query parameter to get the search value
  // in the url /search?username=jerryl the query parameter 'username' is 'jerryl'
  // const username = req.query.username

  const query = req.params.id;

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

  // Just straight away return list of users no need extra attribute name 
  // json({ searchResult })
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
  const FriendId = req.params.id; // friendId

  // validate if the id exists
  // const user = User.FindOne({ where: { id: friendId } })
  // if (!user) throw new NotFoundError('User does not exist.')

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

  // Join table first then query the users directly and only need userid, username and pfp attributes
  const requestors = await User.findAll({
    where: {
      id: requestorIds
    }
  });

  res.status(StatusCodes.OK).json({ friendRequests: requestors });
};

const acceptFriendRequest = async (req, res) => {
  const requestorId = req.params.id;

  // validate if the id exists

  const friendRequest = await Friendship.findOne({
    where: {
      requestor: requestorId,
      requestee: req.user.id,
      accepted: false
    }
  });

  // if (!friendRequest) throw new NotFoundError('Friend request does not exist.')

  friendRequest.accepted = true;
  const Requeststatus = await friendRequest.save(); // delete unused variable names so just save() can alr
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

  // do this 3 lines only
  // if (!friendRequest) throw new NotFoundError('Friend request does not exist.')
  // await friendRequest.destroy()
  // res.status(StatusCodes.OK).json({ msg: "Friend request declined successfully." });

  if (friendRequest) {
    await friendRequest.destroy();
    res.status(StatusCodes.OK).json({ msg: "Friend request declined successfully." });
  } else {
    throw new BadRequestError('Friend request not declined.')
  }
};

const removeFriend = async (req, res) => {
  const friendId = req.params.id;

  // validate if the id exists

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
