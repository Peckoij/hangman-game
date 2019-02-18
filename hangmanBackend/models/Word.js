var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    word: [String],
    language: {
        type: String,
        required: true
    }
});
const Word = mongoose.model('Word', UserSchema);
module.exports = Word;