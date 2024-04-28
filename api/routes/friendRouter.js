const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authentication');

const {
  searchUsers,
  getFriends,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend
} = require('../controllers/friendController');

router.route('/')
    .get(authenticateUser,getFriends);

router.route('/:id')
  .post(authenticateUser,sendFriendRequest)
  .delete(authenticateUser,removeFriend);


router.route('/search')
  .get(authenticateUser,searchUsers)


router.route('/request')
  .get(authenticateUser,getFriendRequests)

router.route('/req/:id')
  .patch(authenticateUser,acceptFriendRequest)
  .delete(authenticateUser,declineFriendRequest);

module.exports = router;