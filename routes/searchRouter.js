const express = require('express');
const propertyController = require('../controllers/propertyController');
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const searchRouter = express.Router();
var jsonParser = bodyParser.json();

searchRouter.get('/search/:query', jsonParser/* , authenticateToken */, propertyController.searchQuery);

module.exports = searchRouter