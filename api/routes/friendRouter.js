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

router.route('/find/:id')
  .get(authenticateUser,findFriends)

  
router.route('/request/')
  .get(authenticateUser,getFriendRequests)


router.route('/request/:id')
  .patch(authenticateUser,acceptFriendRequest)
  .delete(authenticateUser,declineFriendRequest);

module.exports = router;