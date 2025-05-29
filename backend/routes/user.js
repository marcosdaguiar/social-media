const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const check = require('../middlewares/auth');

//Define routes for user operations
router.get("/user-test", check.auth, UserController.testUser);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile/:id", check.auth, UserController.profile);



// Export the router
module.exports = router;