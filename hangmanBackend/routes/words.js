var express = require('express');
var router = express.Router();
const wordController = require('../controllers/wordController');
const authorize = require('../verifytoken');
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Words route' });
  });

// return all words on document of given language, language as parameter
router.get('/list/:language', wordController.getList);
// return names of all language lists
router.get('/listLanguages', wordController.getLanguages);
// returns single, random, approved word for game
router.get('/word/:language', wordController.getWord);
// add new word to languges unapproved words list
router.put('/word/:language', wordController.putWord);


// routes requiring authentication
// add new word list with name of language
router.post('/addLanguage', authorize.verifyToken, wordController.addLanguage);
// delete word from given document and word list inside that document
router.post('/delete', authorize.verifyToken, wordController.deleteWord);
// delete word from given document and word list inside that document
router.post('/approve', authorize.verifyToken, wordController.approveWord);
// add new word to languges unapproved words list
router.put('/wordNewApproved/:language', authorize.verifyToken, wordController.putApprovedWord);

module.exports = router;


