// Import required dependencies
const bcrypt = require("bcrypt");
const mongoosePaginate = require('mongoose-paginate-v2');
const fs = require('fs');
const path = require('path');

// import User model
const User = require("../models/user");

//import services
const jwtService = require("../services/jwt");
const followService = require("../services/followService");
const Follow = require("../models/follow");
const Post = require("../models/post");
const e = require("express");

// testing actions
const testUser = (req, res) => {
  return res.status(200).json({
    message: "Message sent from User controller",
    user: req.user, // user data from middleware
  });
};

// user Registration
const registerUser = async (req, res) => {
  try {
    // get data from request body
    let params = req.body;

    // validate data
    const validateUser = (params) => {
      if (
        !params.name ||
        !params.surname ||
        !params.username ||
        !params.email ||
        !params.password
      ) {
        return res.status(400).json({
          status: "error",
          message: "All fields are required",
        });
      }
      return true;
    };

    // Call the validation function
    const validationResult = validateUser(params);
    if (validationResult !== true) {
      return validationResult;
    }

    // duplicate check
    const users = await User.find({
      $or: [
        { username: params.username.toLowerCase() },
        { email: params.email.toLowerCase() },
      ],
    });

    if (users && users.length >= 1) {
      return res.status(400).json({
        status: "error",
        message: "Username or email already exists",
      });
    }

    // password encryption
    const hash = await bcrypt.hash(params.password, 10);
    params.password = hash;

    // Create user object
    let userToSave = new User(params);
    console.log("User to save:", userToSave);

    try {
      // Save user to database using async/await
      const userStored = await userToSave.save();

      console.log("User stored:", userStored);

      // return response
      return res.status(200).json({
        status: "success",
        message: "User registration successful",
        user: userStored,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Error saving user to database",
        error: err.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error in user registration",
      error: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  //  get data from request body
  let params = req.body;
  if (!params.email || !params.password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  // search user in database
  User.findOne({ email: params.email.toLowerCase() }).then(async (user) => {
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(params.password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    }

    // generate token (not implemented yet)
    const token = jwtService.createToken(user); // Placeholder for token generation logic
    // );

    // Remove password from response
    const userToSend = user.toObject();
    delete userToSend.password;

    // return user data
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: userToSend._id,
        name: userToSend.name,
        surname: userToSend.surname,
        username: userToSend.username,
      },
      token: token,
    });
  });
};

const profile = async (req, res) => {
  try {
    // Get user ID from URL parameter
    const id = req.params.id;

    // Find user by ID and exclude password and role fields
    const userProfile = await User.findById(id).select("-password -role");

    if (!userProfile) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Info of following and followers
    const followInfo = await followService.followThisUser(req.user.id, id);

    return res.status(200).json({
      status: "success",
      user: userProfile,
      following: followInfo.following,
      followers: followInfo.followers,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

const list = async (req, res) => {
    try {
      // Get page number from params or default to 1
      let page = req.params.page ? parseInt(req.params.page) : 1;

      // Set options for pagination
      const options = {
        page: page,
        limit: 5,
        sort: { _id: 1 },
        select: "-password -role -__v -email", // Exclude password, role, and version key
      };

      // Execute pagination
      const users = await User.paginate({}, options);

      // Check if users exist
      if (!users || users.totalDocs === 0) {
        return res.status(404).json({
          status: "error",
          message: "No users found",
        });
      }
      // get an array of ids of the users that are following the current user and the ones the current user is following
      let followUserIds = await followService.followUserIds(req.user.id);

      return res.status(200).json({
        status: "success",
        pagination: {
          current: users.page,
          previous: users.hasPrevPage ? users.prevPage : null,
          next: users.hasNextPage ? users.nextPage : null,
          total: users.totalDocs,
          pages: users.totalPages,
          itemsPerPage: users.limit,
          user_following: followUserIds.following,
          user_follow_me: followUserIds.followers
        },
        users: users.docs,
      });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error fetching users list",
            error: error.message
        });
    }
};

const uploadProfilePicture = async (req, res) => {
    try {
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
            // delete file from server upload/profile_pictures
            const fs = require('fs');
            const filePath = `./uploads/profile_pictures/${req.file.filename}`;
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
        const userUpdated = await User.findByIdAndUpdate(
            { _id: userId },
            { profilePicture: filePath },
            { new: true }
        ).select('-password -role');
        // Check if user was found and updated
        if (!userUpdated) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        // Return success response
        return res.status(200).json({
            status: "success",
            message: "Profile picture updated successfully",
            file: req.file,
            user: userUpdated
        });
    } catch (error) {
        return res.status(500).json({
            status: "error", 
            message: "Error updating profile picture",
            error: error.message
        });
    } 
};


const updateUser = async (req, res) => {
    try {
        // Get user info to update
        let userIdentity = req.user;
        let userToUpdate = req.body;

        // delete fields that should not be updated
        delete userToUpdate.iat;
        delete userToUpdate.exp;
        delete userToUpdate.role;

        // verify if user exists
        const users = await User.find({
            $or: [
                { username: userToUpdate.username },
                { email: userToUpdate.email },
            ],
        });

        let userIsSet = false;
        users.forEach(user => {
            if (user && user._id != userIdentity.id) {
                userIsSet = true;
            }
        });

        if (!userIsSet && users.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        // If password is provided, hash it
        if (userToUpdate.password) {
            const pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        }
        else {
            // If password is not provided, remove it from the object
            delete userToUpdate.password;
        }

        // Update user in database
        try {
            const userUpdated = await User.findByIdAndUpdate(
                {_id: userIdentity.id },
                userToUpdate,
                { new: true }
            ).select('-password -role');

            return res.status(200).json({
                status: "success",
                message: "User updated successfully",
                user: userUpdated
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error updating user",
                error: error.message
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error in update process",
            error: error.message
        });
    }
};

const getProfilePicture = (req, res) => {
    // Get file name from request parameters
    const fileName = req.params.fileName;

    // Construct the file path
    const filePath = `./uploads/profile_pictures/${fileName}`;

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

const counter = async (req, res) => {
        // Get user ID from request
        let userId = req.user.id;

        // Get user by ID and select only the necessary fields
        if (req.params.id) {
            userId = req.params.id;
        }

        try{
          const followingCount = await Follow.countDocuments({'user': userId});
          const followerCount = await Follow.countDocuments({'following': userId});
          const postCount = await Post.countDocuments({'user': userId});

          // Return the counts
          return res.status(200).json({
              status: "success",
              following: followingCount,
              followers: followerCount,
              posts: postCount
          });
        }catch (error) {
          return res.status(500).json({
              status: "error",
              message: "Error fetching user data",
              error: error.message
          });
      }
};



// Export the test function
module.exports = {
  testUser,
  registerUser,
  loginUser,
  profile,
  list,
  updateUser,
  uploadProfilePicture,
  getProfilePicture,
  counter
};
