// import models
const follow = require('../models/follow');
const User = require('../models/user');

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
                populate: { path: 'followed', select: 'name surname username' },
                select: '-__v -user -_id'
            }
        );

        // Check if the user has no following
        if (!follows || follows.docs.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No following found'
            });
        }
        // Return the list of following
        return res.status(200).json({
            status: 'success',
            follows: follows.docs,
            total: follows.totalDocs,
            pages: follows.totalPages
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
    // Get user ID from request
    const userId = req.user.id;

    // Get id from request parameters
    const followedId = req.params.id;

    // verify page parameter
    const page = req.params.page ? parseInt(req.params.page) : 1;
    // Define items per page
    const itemsPerPage = 5;

    // If followedId is not provided, use the current user's ID
    const userToFollow = followedId || userId;

    // Find a follow, get data of the user and paginate with mongoose-paginate-v2

    // Get an array of ids of the users that are following the current user and the ones the current user is following

    



    
    // Find all users that are following the current user
    try {
        const follows = await follow.find({ followed: userToFollow })
            .populate('user', 'name surname _id image')
            .paginate(page, itemsPerPage);

        // Check if the user has no followers
        if (!follows || follows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No followers found'
            });
        }

        // Return the list of followers
        return res.status(200).json({
            status: 'success',
            follows,
            total: follows.total,
            pages: Math.ceil(follows.total / itemsPerPage)
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error retrieving followers',
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