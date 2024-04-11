const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authentication');

const {
    getFriends,
    findFriends,
    addFriend,
    getFriendRequests,
    acceptFriendRequest,
    removeFriend,
    declineFriendRequest
} = require('../controllers/friendController');




router.route('/')
    .get(authenticateUser,getFriends);


router.route('/:id')
  .post(authenticateUser,addFriend)
  .delete(authenticateUser,removeFriend);

router.route('/find/:id')
  .get(authenticateUser,findFriends)

  
router.route('/req/')
  .get(authenticateUser,getFriendRequests)


router.route('/req/:id')
  .patch(authenticateUser,acceptFriendRequest)
  .delete(authenticateUser,declineFriendRequest);

module.exports = router;