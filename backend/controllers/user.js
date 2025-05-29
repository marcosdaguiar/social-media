// Import required modules
const User = require("../models/user");
const bcrypt = require("bcrypt");

//import services
const jwtService = require("../services/jwt");
const user = require("../models/user");

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
    if(!params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Email and password are required"
        });
    }

    // search user in database
    User.findOne({email: params.email.toLowerCase()})
    .then(async (user) => {
        if(!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        // check password
        const isMatch = await bcrypt.compare(params.password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid password"
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
            token: token
        });
    })
}


const profile = async (req, res) => {
    try {
        // Get user ID from URL parameter
        const id = req.params.id;

        // Find user by ID and exclude password and role fields
        const userProfile = await User.findById(id).select('-password -role');

        if (!userProfile) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: "success",
            user: userProfile
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error fetching user profile",
            error: error.message
        });
    }
};

// Export the test function
module.exports = {
  testUser,
  registerUser,
  loginUser,
  profile
};
