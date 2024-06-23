const { BadRequestError } = require('../errors');

const preventSelfFriendRequest = async(req,res,next) =>{
    if (req.params.friendId == req.user.id){
        throw new BadRequestError('Invalid request. Friending ownself.')
    }
    return next()
}

module.exports = preventSelfFriendRequest;
    
