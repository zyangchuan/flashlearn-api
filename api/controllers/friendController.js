const { Sequelize } = require('../db/sequelize');

// Take away all the unused packages
// Remember to add the foreign key constraints for the Friendship model in the index.js file

const { BadRequestError, NotFoundError } = require('../errors');
const notFound = require('../middlewares/not-found');
const { Friendship, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const findFriends = async (req, res) => {
    const query = req.params.id;

    // variable name use searchResult
    const friendsFinder = await User.findAll({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('username')),
        {
          [Sequelize.Op.like]: query.toLowerCase() + '%'
        }
      )
    });

    // No need to do check and throw error in this case 
    // cuz empty result is a valid result
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
      // Add this line below cuz these are the only attributes we need
      // attributes: ['requestee', 'requestor]
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

  // Join the table first so u dont need to query again
  const friends = await User.findAll({
    where: {
      id: friendIds
    }
  });

  res.status(StatusCodes.OK).json({ friends });
};

// Use sendFriendRequest for the function name
const addFriend = async (req, res) => {
  const FriendId = req.params.id;
  Friendship.create({
    requestee: req.user.id,
    requestor: FriendId, // Why is the requestor the target user
    accepted: false
  })

  // Msg use friend request sent
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


  // Use join table
  const requestors = await User.findAll({
    where: {
      id: requestorIds
    }
  });

  res.status(StatusCodes.OK).json({ friendRequests: requestors });
};

const acceptFriendRequest = async (req, res) => {
  const friendId = req.params.id; // variable name use requestorId

  const friendRequest = await Friendship.findOne({
    where: {
      requestor: friendId,
      requestee: req.user.id,
      accepted: false
    }
  });


  // Use friendRequest.accepted = true
  //     await friendRequest.save()
  if (friendRequest) {
    await friendRequest.update({
      accepted: true
    });

    res.status(StatusCodes.OK).json({ msg: "Friend request accepted successfully." });
  } else {

    // Eh this one must be more specific cannot let the front end guess
    // Again friend request result can be empty cuz its a valid result so dont need to throw error for this case
    // So just validate if the friend request has already been accepted and throw error
    res.status(StatusCodes.NOT_FOUND).json({ error: "Friend request not found or already accepted." });
  }
};

const declineFriendRequest = async (req, res) => {
  const friendId = req.params.id; // Use requestorId

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
    // Same thing as above
    res.status(StatusCodes.NOT_FOUND).json({ error: "Friend request not found or already accepted." });
  }
};


// This function just find friendship record and delete can already
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

    // Throw notFoundError if no record found
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
