const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authentication');

const {
  getFriends,
  findFriends,
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

// use '/search'
router.route('/find/:id')
  .get(authenticateUser,findFriends)

// delete trailing back slash
// use full variable name 'request'
router.route('/req/')
  .get(authenticateUser,getFriendRequests)

router.route('/req/:id')
  .patch(authenticateUser,acceptFriendRequest)
  .delete(authenticateUser,declineFriendRequest);

module.exports = router;