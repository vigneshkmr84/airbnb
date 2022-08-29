const express = require('express');
const userController = require('../controllers/userController'); 
const bodyParser = require('body-parser');

const router  = express.Router(); 
var jsonParser = bodyParser.json();

router.post('/login', jsonParser, userController.login);
router.post('/signup', jsonParser, userController.signup);

router.get('/users/:id', jsonParser, userController.getUserById);
router.get('/users/:id/payment', jsonParser, userController.getUserPaymentDetails);
router.post('/users/:id/payment', jsonParser, userController.addPaymentToUser);

router.post('/users/toHost/:id', jsonParser, userController.changeUserToHost);
router.post('/users/update', jsonParser, userController.updateUserById);
router.delete('/users/:id', jsonParser, userController.deleteUser);

module.exports = router;
