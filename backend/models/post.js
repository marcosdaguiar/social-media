const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const PostSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
PostSchema.plugin(mongoosePaginate);
module.exports = model('Posts', PostSchema, 'posts'); // 'stories' is the collection name in MongoDB
