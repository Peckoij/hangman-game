var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // approved words
    aWord: [String],
    // unapproved words AKA words waiting for admins approval
    uaWord: [String],
    language: {
        type: String,
        required: true
    }
});
const Word = mongoose.model('Word', UserSchema);
module.exports = Word;