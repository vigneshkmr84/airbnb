const express = require('express');
const bodyParser = require('body-parser');

const userController = require('../controllers/userController'); 

const router  = express.Router(); 
var jsonParser = bodyParser.json();

router.get('/users', jsonParser, userController.getAllUsers);
module.exports = router;
