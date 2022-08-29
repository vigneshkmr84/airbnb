const express = require('express');
const userController = require('../controllers/userController'); 
const bodyParser = require('body-parser');

const router  = express.Router(); 
var jsonParser = bodyParser.json();

router.post('/users/:id/favourite', jsonParser, userController.addToFavourites);
router.delete('/users/:id/favourite', jsonParser, userController.removeFromFavourites);

module.exports = router;
