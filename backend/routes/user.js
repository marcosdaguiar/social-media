const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

//Define routes for user operations
router.get("/user-test", UserController.testUser);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

// Export the router
module.exports = router;