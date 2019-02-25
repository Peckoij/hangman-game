var express = require('express');
var router = express.Router();
const userCon = require('../controllers/userController'); // user routes controller
const authorize = require('../verifytoken'); // token verification

// create new account 
router.post('/register', userCon.registerUser);
// logging in with username and password
router.post('/login', userCon.authenticateUser);

// get highscore
router.get('/highscore', userCon.getHighscore);

router.post('/changePassword', userCon.changePassword)
module.exports = router;
