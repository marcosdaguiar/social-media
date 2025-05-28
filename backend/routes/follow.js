const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/follow');

//Define routes for follow operations
router.get("/follow-test", FollowController.testFollow);

// Export the router
module.exports = router;