const {Schema, model} = require('mongoose');
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'default.png'
    },
    role: {
        type: String,
        default: 'role_user',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('User', userSchema, 'users'); // 'users' is the name of the collection in MongoDB
