const { BadRequestError } = require('../errors');
const { validationResult } = require('express-validator');
const { Friendship, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const showFriend = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    try {
        // Find friendships where the current user is the requestor and the friendship is accepted
        const requesterFriendships = await Friendship.findAll({
            where: {
                requestor: req.params.id,
                accepted: true
            }
        });

        // Find friendships where the current user is the requestee and the friendship is accepted
        const requesteeFriendships = await Friendship.findAll({
            where: {
                requestee: req.params.id,
                accepted: true
            }
        });

        // Combine both sets of friendships
        const allFriendships = [...requesterFriendships, ...requesteeFriendships];

        // Extract friend IDs
        const friendIds = allFriendships.map(friendship => {
            if (friendship.requestor === req.params.id) {
                return friendship.requestee;
            } else {
                return friendship.requestor;
            }
        });

        // Assuming you have a User model, you can fetch user details for each friend
        const friends = await User.findAll({
            where: {
                id : friendIds
            }
        });

        res.status(StatusCodes.OK).json({ friends });
    } catch (error) {
        console.error('Error retrieving friends:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: [{ msg: "An error occurred while retrieving friends." }] });
    }
};



const addFriend = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { username } = req.body;

    try {
        // Find the user with the given username
        const user = await User.findOne({
            where: {
                username: username
            }
        });

        // If user is found, create the friendship request
        if (user) {
            const friendship = await Friendship.create({
                requestor: req.params.id,
                requestee: user.id,
                accepted: false
            });
            res.status(StatusCodes.CREATED).json({ msg: "Friend request sent.", requestor: req.params.id, requestee_id: user.id });
        } else {
            // If user with the given username doesn't exist, return a bad request response
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: [{ msg: "User with the provided username does not exist." }] });
        }
    } catch (error) {
        console.error('Error adding friend:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: [{ msg: "An error occurred while adding friend." }] });
    }
};


const showFriendRequests = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    try {
        // Find friend requests where the current user is the requestee and the request is not yet accepted
        const friendRequests = await Friendship.findAll({
            where: {
                requestee: req.params.id,
                accepted: false
            }
        });

        // Extract requestor IDs
        const requestorIds = friendRequests.map(friendRequest => friendRequest.requestor);

        // Fetch user details for each requestor
        const requestors = await User.findAll({
            where: {
                id: requestorIds
            }
        });

        res.status(StatusCodes.OK).json({ friendRequests: requestors });
    } catch (error) {
        console.error('Error retrieving friend requests:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: [{ msg: "An error occurred while retrieving friend requests." }] });
    }
};


const acceptFriendRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    try {
        // Find the friend request to accept
        console.log(req.params.friendId)
        console.log(req.params.id)
        const friendRequest = await Friendship.findOne({
            where: {
                requestor: req.params.friendId, // Assuming friendId is the ID of the user who sent the friend request
                requestee: req.params.id, // Current user's ID
                accepted: false
            }
        });

        // If friend request is found, update it to mark as accepted
        if (friendRequest) {
            await friendRequest.update({
                accepted: true
            });

            res.status(StatusCodes.OK).json({ msg: "Friend request accepted successfully." });
        } else {
            // If no friend request found, return a not found response
            return res.status(StatusCodes.NOT_FOUND).json({ errors: [{ msg: "Friend request not found or already accepted." }] });
        }
    } catch (error) {
        console.error('Error accepting friend request:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: [{ msg: "An error occurred while accepting friend request." }] });
    }
};

const declineFriendRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    try {
        // Find the friend request to decline
        const friendRequest = await Friendship.findOne({
            where: {
                requestor: req.params.friendId, // Assuming friendId is the ID of the user who sent the friend request
                requestee: req.params.id, // Current user's ID
                accepted: false
            }
        });

        // If friend request is found, delete it
        if (friendRequest) {
            await friendRequest.destroy();
            return res.status(StatusCodes.OK).json({ msg: "Friend request declined successfully." });
        } else {
            // If no friend request found, return a not found response
            return res.status(StatusCodes.NOT_FOUND).json({ errors: [{ msg: "Friend request not found or already accepted." }] });
        }
    } catch (error) {
        console.error('Error declining friend request:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: [{ msg: "An error occurred while declining friend request." }] });
    }
};


const removeFriend = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    try {
        // Find the IDs of both users
        const currentUser = await User.findOne({ where: { username: req.params.currentUserUsername } });
        const friendUser = await User.findOne({ where: { username: req.params.friendUsername } });

        if (!currentUser || !friendUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ errors: [{ msg: "One or both users not found." }] });
        }

        // Delete the friendship
        const deletedFriendshipCount = await Friendship.destroy({
            where: {
                [Op.or]: [
                    { requestor: currentUser.id, requestee: friendUser.id },
                    { requestor: friendUser.id, requestee: currentUser.id }
                ]
            }
        });

        if (deletedFriendshipCount > 0) {
            return res.status(StatusCodes.OK).json({ msg: "Friend removed successfully." });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ errors: [{ msg: "Friendship not found." }] });
        }
    } catch (error) {
        console.error('Error removing friend:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: [{ msg: "An error occurred while removing friend." }] });
    }}


module.exports = {
    showFriend,
    addFriend,
    showFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend

};
