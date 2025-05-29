// import dependencies
const jwt = require('jwt-simple');
const moment = require('moment');

// import secret key
const secret = 'your_secret_key_here'; // Replace with your actual secret key


// create a function to generate token
const createToken = (user) => {
    // create payload with user data and expiration time
    const payload = {
        id: user._id, // user ID
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
        iat: moment().unix(), // issued at time
        exp: moment().add(30, 'days').unix() // expiration time (30 days)
    };

    // return jwt token encoded
    return jwt.encode(payload, secret);
}

module.exports = {
    createToken,
    secret
};