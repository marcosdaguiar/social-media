const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post');

//Define routes for user operations
router.get("/post-test", PostController.testPost);

// Export the router
module.exports = router;