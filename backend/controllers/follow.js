// import models
const follow = require('../models/follow');
const user = require('../models/user');

// import services
const followService = require('../services/followService')

// import dependencies
const mongoosePaginate = require ('mongoose-paginate-v2');


// testing actions
const testFollow = (req, res) => {
    return res.status(200).json({
        message: 'Message sent from testFollow controller',
    });
}

// Following a user

// Save a follow relationship
const save = async (req, res) => {
    // Get data from request body
    const params = req.body;

    // Get user ID from request
    const userId = req.user;

    // Create object to save with follow data
    let userToFollow = new follow(
        {
            user: userId.id, // The user who is following
            followed: params.followed // The user being followed
        }
    );

    // Save object in the database
    try {
        const followStored = await userToFollow.save();
        if (!followStored) {
            return res.status(404).json({
                status: 'error',
                message: 'Follow relationship not saved'
            });
        }
        return res.status(200).json({
        status: 'success',
        userId,
        follow: followStored,
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error saving follow relationship',
            error: error.message
        });
    }
        
        
}

// delete a follow relationship
const unfollow = async (req, res) => {

    // Get user ID from request
    const userId = req.user.id;

    // Get the ID of the user to unfollow from request parameters
    const followedId = req.params.id;

    // Check if the user is trying to unfollow themselves
    if (userId === followedId) {
        return res.status(400).json({
            status: 'error',
            message: 'You cannot unfollow yourself'
        });
    }

    // Find the follow relationship to delete
    try {
        const followDeleted = await follow.findOneAndDelete({
            user: userId,
            followed: followedId
        });

        // Check if the follow relationship was found and deleted
        if (!followDeleted) {
            return res.status(404).json({
                status: 'error',
                message: 'Follow relationship not found or already deleted'
            });
        }

        // If successful, return a success response
        return res.status(200).json({
            status: 'success',
            message: 'Unfollowed successfully',
            follow: followDeleted
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error unfollowing user',
            error: error.message
        });
    }
}


// Get a list of users that the current user is following
const following = async (req, res) => {
    try {
        // Get user ID from request
        let userId = req.user.id;

        // verify if the user ID is provided in the request parameters
        if (req.params.id) userId = req.params.id;
        
        // verify page parameter
        let page = req.params.page ? parseInt(req.params.page) : 1;
        
        // Define items per page
        const itemsPerPage = 5;

        // Find follows and populate user details
        const follows = await follow.paginate(
            { user: userId },
            {
                page: page,
                limit: itemsPerPage,
                populate: { path: 'following', select: 'name surname username' },
                select: '-__v -user -_id -createdAt',
            }
        )
        

        // get an array of ids of the users that are following the current user and the ones the current user is following
        let followUserIds = await followService.followUserIds(userId);

        return res.status(200).json({
            status: 'success',
            userId: userId,
            follows: follows.docs,
            total: follows.totalDocs,
            pages: follows.totalPages,
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers

        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error retrieving following list',
            error: error.message
        });
    }
};

// Get a list of followers for a user
const followers = async (req, res) => {
    try {
        // Get user ID from request
        let userId = req.user.id;

        // verify if the user ID is provided in the request parameters
        if (req.params.id) userId = req.params.id;
        
        // verify page parameter
        let page = req.params.page ? parseInt(req.params.page) : 1;
        
        // Define items per page
        const itemsPerPage = 5;

        // Find follows and populate user details
        const follows = await follow.paginate(
            { following: userId },
            {
                page: page,
                limit: itemsPerPage,
                populate: { path: 'user', select: 'name surname username' },
                select: '-__v -user -_id -createdAt -following',
            }
        );

        // get an array of ids of the users that are following the current user and the ones the current user is following
        let followUserIds = await followService.followUserIds(userId);

        return res.status(200).json({
            status: 'success',
            message: 'Followers retrieved successfully',
            userId: userId,
            //follows: follows.docs, // The list of followers
            followers: follows.docs,
            total: follows.totalDocs,
            pages: follows.totalPages,
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error retrieving following list',
            error: error.message
        });
    }
}

// list followers 

    // Export the test function
module.exports = {
    testFollow,
    save,
    unfollow,
    followers,
    following
};