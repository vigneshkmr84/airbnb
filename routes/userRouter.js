const express = require('express');
const userController = require('../controllers/userController'); 
const bodyParser = require('body-parser');

const router  = express.Router(); 
var jsonParser = bodyParser.json();

router.post('/login', jsonParser, userController.login);
router.post('/signup', jsonParser, userController.signup);

router.get('/users/:id', jsonParser, userController.getSpecificId);
router.post('/users/toHost/:id', jsonParser, userController.changeUserToHost);

router.delete('/users/:id', jsonParser, userController.deleteUser);

module.exports = router;
