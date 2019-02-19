var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    score: {
        type: Number,
        default: 0
    }

});
const User = mongoose.model('User', UserSchema);
module.exports = User;