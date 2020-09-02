const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const {ObjectId} = Schema.Types
const userSchema = new Schema ({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        default: 'https://res.cloudinary.com/devdoingstuff/image/upload/v1597605409/no-profile_d2ylvb.jpg'
    },
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }],
    verified: false,
    resetToken: String,
    expireToken: Date,
    verifyToken: String
});


const users = mongoose.model('User',userSchema);
module.exports = users;