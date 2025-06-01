const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const check = require('../middlewares/auth');

//Define routes for user operations
router.get("/user-test", check.auth, UserController.testUser);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile/:id", check.auth, UserController.profile);
router.get("/list", check.auth, UserController.list);
router.get("/list/:page", check.auth, UserController.list);
router.put("/update", check.auth, UserController.updateUser);



// Export the router
module.exports = router;