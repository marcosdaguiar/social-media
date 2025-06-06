const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: String,
    bio: String,
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
UserSchema.plugin(mongoosePaginate);

module.exports = model('User', UserSchema);
