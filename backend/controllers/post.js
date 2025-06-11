// Import necessary modules
const fs = require('fs');
const path = require('path');

// Import the Post model
const Post = require('../models/post');

// Import Services
const FollowService = require('../services/followService');

// testing actions
const testPost = (req, res) => {
    return res.status(200).json({
        message: 'Message sent from Post controller',
    });
    }

// Save a post
const save = (req, res) => {

        try{
        // get data from request body
        const params = req.body;

        // send error if content is not provided
        if (!params.content) {
            return res.status(400).json({
                status: 'error',
                message: 'Content is required',
            });
        }

        // create a new post object
        let newPost = new Post(params);
        newPost.user = req.user.id; // set the user from the authenticated user

        // save object to database
        const postStored = newPost.save();
        //return response
        return res.status(200).json({
            status: 'success',
            message: 'Post saved successfully',
            post: newPost
        })
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error saving post',
            error: error.message
        });
    }   
}

// get a post
const getPost = async (req, res) => {

    try {

        // get post id from request parameters
        const postId = req.params.id;

        // check if postId is provided
        if (!postId) {
            return res.status(400).json({
                status: 'error',
                message: 'Post ID is required',
            });
        }
        // find post by id
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }
        else{
            // return post
            return res.status(200).send({
                message: 'Get post functionality not implemented yet',
                status: 'success',
                post: post,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error retrieving post',
            error: error.message
        });
    }
}

// delete a post
const deletePost = async (req, res) => {
    // Get post ID from request parameters
    const postId = req.params.id;

    // Check if postId is provided
    if (!postId) {
        return res.status(400).json({
            status: 'error',
            message: 'Post ID is required',
        });
    }

    // Find and delete the post by ID
    try {
        const postDeleted = await Post.findByIdAndDelete(postId);
        
        // Check if the post was found and deleted
        if (!postDeleted) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found or already deleted',
            });
        }

        // If successful, return a success response
        return res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully',
            post: postId,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error deleting post',
            error: error.message
        });
    }
}

// list posts of a user
const userPosts = async (req, res) => {

    try{
        // Get user ID from request parameters
        const userId =  req.params.id;

        // get page number from request parameters
        const page = await req.params.page //? Number(req.params.page) : 1;  // default to 1 if missing or invalid

        // pagination options
        const options = {
            page: page,
            limit: 2, // number of posts per page
            sort: ( '-createdAt' ), // sort by creation date, newest first
            select: ('-user -__v') // exclude user field from the result
        };

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required',
            });
        }
        // Find posts by user ID with pagination
        const posts = await Post.paginate({ user: userId }, options);
        // Check if posts were found
        if (!posts || posts.docs.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No posts found for this user',
            });
        }
        // If successful, return the posts
        return res.status(200).json({
            message: 'List user posts functionality not implemented yet',
            status: 'success',
            user: userId,
            posts: posts
        })
    }catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error retrieving user posts',
            error: error.message
        });
        }
}


// upload a file to a post
const uploadPostPicture = async (req, res) => {
    try {
        // Get post ID from request parameters
        const postId = req.params.id;

        // Get user ID from request
        const userId = req.user.id;

        // get file name from request
        if (!req.file || !req.file.filename) {
            return res.status(400).json({
                status: "error",
                message: "File not provided or invalid file format"
            });
        }
        // validate file type
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = req.file.filename.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            // If the file type is not allowed, delete the file and return an error
            // delete file from server upload/posts
            const fs = require('fs');
            const filePath = `./uploads/posts/${req.file.filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
            });
            // Return error response
            return res.status(400).json({
                status: "error",
                message: "Invalid file type. Allowed types are: jpg, jpeg, png, gif"
            });
        }
        
        // Check if file is provided
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No file uploaded"
            });
        }
        // Get file path
        const filePath = req.file.path;
        // Update user profile picture
        const postUpdated = await Post.findByIdAndUpdate(
            { 'user': userId, '_id': postId },
            { file: filePath },
            { new: true }
        ).select('-password -role');
        // Check if post was found and updated
        if (!postUpdated) {
            return res.status(404).json({
                status: "error",
                message: "Post not found"
            });
        }
        // Return success response
        return res.status(200).json({
            status: "success",
            message: "post picture updated successfully",
            file: req.file,
            post: postUpdated
        });
    } catch (error) {
        return res.status(500).json({
            status: "error", 
            message: "Error updating post picture",
            error: error.message
        });
    } 
};


// get a file from a post
const getMedia = (req, res) => {
    // Get file name from request parameters
    const fileName = req.params.file;

    // Construct the file path
    const filePath = `./uploads/posts/${fileName}`;

    // Check if the file exists
    fs.stat(filePath, (error, exists) => {
      if (!exists) {
          return res.status(404).json({
              status: "error",
              message: "Profile picture not found"
          });
      }

      // Send the file as a response
      res.sendFile(path.resolve(filePath))
      }); 
};


// list all posts from all users (feed)
const feed = async (req, res) => {
    // Get page number from request parameters
    const page = req.params.page ? Number(req.params.page) : 1;  // default to 1 if missing or invalid

    // set pagination options
    const options = {
        page: page,
        limit: 2, // number of posts per page
        sort: ('-createdAt'), // sort by creation date, newest first
        select: ('-__v') // exclude user field from the result
    };

    // get array of ids of users that the authenticated user follows
    try{
        const followedUsers = await FollowService.followUserIds(req.user.id);
        
        // find a post with in, sort, populate, and paginate
        const posts = await Post.paginate(
            { user: { $in: followedUsers.following } }, // filter by followed users
            {
                options,
                populate: { path: 'user', select: '-password -role -__v -email' },
                sort: { createdAt: -1 } // sort by creation date, newest first
            }
        );

        // Check if posts were found
        if (!posts || posts.docs.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No posts found for followed users',
                followedUsers: followedUsers.following,
                total: 0,
                page: 1,
                pages: 1,
                posts: []
            });
        }


        return res.status(200).json({
            status: 'success',
            message: 'Feed functionality not implemented yet',
            followedUsers: followedUsers.following,
            total: posts.totalDocs,
            page: posts.page,
            pages: posts.totalPages,
            posts: posts.docs
        });


    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error retrieving followed users',
            error: error.message
        });
    }

    



}


    // Export the test function
module.exports = {
    testPost,
    save,
    getPost,
    deletePost,
    userPosts,
    uploadPostPicture,
    getMedia,
    feed
};