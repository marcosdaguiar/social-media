const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const check = require('../middlewares/auth');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profile_pictures');  // Note the ./ at the start
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.toLowerCase().replace(/\s+/g, '-')}`);
    }
});
const upload = multer({ storage });

//Define routes for user operations
router.get("/user-test", check.auth, UserController.testUser);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile/:id", check.auth, UserController.profile);
router.get("/list/{:page}", check.auth, UserController.list);
router.put("/update", check.auth, UserController.updateUser);
router.post("/upload-profile-picture", [check.auth, upload.single('file0')], UserController.uploadProfilePicture);
router.get("/profile-picture/:fileName", UserController.getProfilePicture);
router.get("/counter/:id", check.auth, UserController.counter);

// Export the router
module.exports = router;