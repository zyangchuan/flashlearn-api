const express = require('express');
const router = express.Router();


const {
    showFriend,
    addFriend,
    showFriendRequests,
    acceptFriendRequest,
    removeFriend,
    declineFriendRequest
} = require('../controllers/friendController');



router.route('/:id')
  .get(showFriend)
  .post(addFriend)
  .delete(removeFriend);

router.route('/req/:id')
  .get(showFriendRequests)
  .patch(acceptFriendRequest)
  .delete(declineFriendRequest);

module.exports = router;