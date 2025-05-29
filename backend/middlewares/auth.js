// import modules
const jwt = require('jwt-simple');
const moment = require('moment');


// import secret key
const libjwt = require('../services/jwt');
const secret = libjwt.secret;

// function to check if user is authenticated
exports.auth = (req, res, next) => {
    // get auth header
    const token = req.headers.authorization;

    // check if token is present
    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'Authorization token is missing'
        });
    }

    try {
        // clean token (remove quotes if present)
        const cleanToken = token.replace(/['"]+/g, '');

        // decode token
        const payload = jwt.decode(cleanToken, secret);

        

        // check if token is expired
        if (payload.exp <= moment().unix()) {
            return res.status(401).json({
                status: 'error',
                message: 'Token has expired'
            });
        }

        // add user to request object
        req.user = payload;

        // call next middleware
        next();
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};