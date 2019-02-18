var express = require('express');
var router = express.Router();
const userCon = require('../controllers/userController'); // user-reittien kontrolleri
const authorize = require('../verifytoken'); // authorisointi eli vahvistetaan token

// rekisteröityminen eli luodaan uudelle käyttäjän tunnarit
router.post('/register', userCon.registerUser);
// kirjautuminen eli autentikaatio tunnareilla
router.post('/login', userCon.authenticateUser);

module.exports = router;
