const express = require('express');
const userController = require('../controllers/userController');
const favouritesController = require('../controllers/favouritesController');
const bodyParser = require('body-parser');

const router = express.Router();
var jsonParser = bodyParser.json();

/* router.get('/users/:id/favourite', jsonParser, userController.getFavouritesByUserId);
router.post('/users/:id/favourite', jsonParser, userController.addToFavourites);
router.delete('/users/:id/favourite', jsonParser, userController.removeFromFavourites); */

router.get('/users/:id/favourite', jsonParser, favouritesController.getFavouritesByUserId);
router.post('/users/:id/favourite', jsonParser, favouritesController.addToFavourites);
router.delete('/users/:id/favourite', jsonParser, favouritesController.removeFromFavourites);

module.exports = router;
