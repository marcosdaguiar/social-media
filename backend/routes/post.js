const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post');
const check = require('../middlewares/auth');
const multer = require('multer');


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/posts');  // Note the ./ at the start
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.toLowerCase().replace(/\s+/g, '-')}`);
    }
});
const upload = multer({ storage });

//Define routes for user operations
router.get("/post-test", PostController.testPost);
router.post("/save", check.auth, PostController.save);
router.get("/get-post/:id", check.auth, PostController.getPost);
router.delete("/delete/:id", check.auth, PostController.deletePost);
router.get("/user-post/:id/{:page}", check.auth, PostController.userPosts);
router.post("/upload-image/:id", [check.auth, upload.single('file0')], PostController.uploadPostPicture);
router.get("/media/:file", PostController.getMedia);
router.get("/feed/{:page}", check.auth, PostController.feed);


// Export the router
module.exports = router;