var jwt = require('jsonwebtoken');
var config = require('../config');
const mongoose = require('mongoose');
require('../models/Word');

const Word = mongoose.model('Word');


exports.addLanguage = function (req, res) {
    //console.log(req.body);
    var word = new Word;
    word.language = req.body.language;
    word.uaWord = ['test1', 'test2', 'test3'];
    Word.find({
        language: word.language
    }, function (err, dbRes) {
        console.log(dbRes);
        if (dbRes[0]) {
            console.log(dbRes);
            return res.status(200).send({
                msg: 'List for given language already exists.'
            })
        } else {
            Word.create(word, function (err, lang) {
                if (err) {
                    return err;
                }
                res.json(lang);
            })
        }
    });

}

// returns array of all languages in collection
exports.getLanguages = function (req, res) {
    Word.find({}, function (err, words) {
        //console.log(words)
        //res.render('/usersList', {users: users});
        var languages = [];
        for (i = 0; i < words.length; i++) {
            languages.push(words[i].language);
        }
     //   console.log(languages);
        res.json(languages)
    });
}

exports.getList = function (req, res) {
    console.log("Get list for: " + req.params.language)
    Word.findOne({
        language: req.params.language
    }, function (err, doc) {
        if (err) console.log(err);        
     //   console.log(doc);
        res.json(doc)
    });
}
exports.getWord = function (req, res) {

}
exports.putWord = function (req, res) {

}

exports.deleteWord = function (req, res) {
    console.log(req.body);
    if (req.body.list == 'uaWord') {
        Word.updateOne({
                "language": req.body.lang
            }, {
                $pull: {
                    "uaWord": req.body.word
                }
            }, {
                upsert: true
            },
            function (err, dbRes) {
                if (err) console.log(err);
                res.json(dbRes)
            });
    } else if (req.body.list == 'aWord') {
        Word.updateOne({
            "language": req.body.lang
        }, {
            $pull: {
                "aWord": req.body.word
            }
        }, {
            upsert: true
        },
        function (err, dbRes) {
            if (err) console.log(err);
            res.json(dbRes)
        });
    } else {
        res.status(200).send({
            msg: 'Invalid list'
        });
    }
}


exports.approveWord = function (req, res) {
   //  console.log(req.body);
        Word.updateOne({
                "language": req.body.lang
            }, {
                $pull: {
                    "uaWord": req.body.word
                },
                $addToSet: {
                    "aWord": req.body.word
                }
            }, {
                upsert: false
            },
            function (err, dbRes) {
                if (err) console.log(err);
                res.json(dbRes)
            });
}

exports.putApprovedWord = function (req, res) {
    // console.log(req.body);
        Word.updateOne({
                "language": req.params.language
            }, {
                $addToSet: {
                    "aWord": req.body.word
                }
            }, {
                upsert: false
            },
            function (err, dbRes) {
                if (err) console.log(err);
                res.json(dbRes)
            });
}
/*
return res.status(400).send('No user found.');

return res.status(200).send({
    auth: true,
    token: token
});
*/