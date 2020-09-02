const mongoose = require('mongoose');
const User = require('../UserSchema/users');

const Schema = mongoose.Schema;
const {ObjectId} = Schema.Types

const postSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    author: {
        type: ObjectId,
        ref: 'User'
    },
    comments: [{
        postedBy: {
            type: ObjectId,
            ref: 'User'
        },
        text: String
    }],
    likes: [{
        type: String,
        ref: 'User'
    }]
})

const posts = mongoose.model('Posts',postSchema);

module.exports = posts;