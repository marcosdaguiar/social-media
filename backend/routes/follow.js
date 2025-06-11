const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/follow');
const check = require('../middlewares/auth');

//Define routes for follow operations
router.get("/following/:id/:page", check.auth, FollowController.following);
router.get("/following/:id", check.auth, FollowController.following);
router.get("/followers/:id/{:page}", check.auth, FollowController.followers);
router.post("/save", check.auth, FollowController.save);
router.delete("/unfollow/:id", check.auth, FollowController.unfollow);

// Export the router
module.exports = router;