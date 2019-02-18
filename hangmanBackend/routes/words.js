var express = require('express');
var router = express.Router();
const wordController = require('../controllers/wordController'); // word-reittien kontrolleri
const authorize = require('../verifytoken'); // authorisointi eli vahvistetaan token

// listaa kaikki yhden kielen sanat, kyselyn parametrinä pitää eritellä kieli
router.get('/list/:language', wordController.getList);
// hakee yhden sanan peliä varten
router.get('/word', wordController.getWord);
// lisää uuden sanan haluttuun sana listaans
router.put('/word', wordController.putWord);

module.exports = router;