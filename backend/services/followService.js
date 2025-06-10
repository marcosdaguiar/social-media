const Follow = require('../models/follow');

const followUserIds = async(identityUserId)=>{
    // Get the list of users that the identity user is following
    let following = await Follow.find({'user': identityUserId}).select('following -_id').exec();

    // Get the list of users that are following the identity user
    let followers = await Follow.find({'following': identityUserId}).select('user -_id').exec();

    // Process array of identifiers to return only the user IDs
    let followingClean = following.map(follow => follow.following.toString());
    let followersClean = followers.map(follow => follow.user.toString());


    return{
        following: followingClean,
        followers: followersClean
    }
}

const followThisUser = async(identityUserId, followedUserId) => {
    let following = await Follow.findOne({'user': identityUserId, "following": followedUserId })


    // Get the list of users that are following the identity user
    let followers = await Follow.find({'following': followedUserId, "following": identityUserId })


    return {
        following,
        followers
    }
}

module.exports = {
    followUserIds,
    followThisUser
};