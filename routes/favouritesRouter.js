const express = require('express');
const userController = require('../controllers/userController');
const bodyParser = require('body-parser');

const router = express.Router();
var jsonParser = bodyParser.json();

router.get('/users/:id/favourite', jsonParser, userController.getFavouritesByUserId);
router.post('/users/:id/favourite', jsonParser, userController.addToFavourites);
router.delete('/users/:id/favourite', jsonParser, userController.removeFromFavourites);

module.exports = router;
