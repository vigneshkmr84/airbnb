const express = require('express');
const userController = require('../controllers/userController');
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const router = express.Router();
var jsonParser = bodyParser.json();

router.post('/login', jsonParser, userController.login);
router.post('/signup', jsonParser, userController.signup);

/* router.get('/users/:id', jsonParser, userController.getUserById);
router.get('/users/:id/payment', jsonParser, userController.getUserPaymentDetails);
router.post('/users/:id/payment', jsonParser, userController.addPaymentToUser);

router.post('/users/:id/toHost', jsonParser, userController.changeUserToHost);
router.post('/users/:id/update', jsonParser, userController.updateUserById);
router.delete('/users/:id', jsonParser, userController.deleteUser); */

router.get('/users/:id', jsonParser, authenticateToken, userController.getUserById);
router.get('/users/:id/payment', jsonParser, authenticateToken, userController.getUserPaymentDetails);
router.post('/users/:id/payment', jsonParser, authenticateToken, userController.addPaymentToUser);

router.post('/users/:id/toHost', jsonParser, authenticateToken, userController.changeUserToHost);
router.post('/users/:id/update', jsonParser, authenticateToken, userController.updateUserById);
router.delete('/users/:id', jsonParser, authenticateToken, userController.deleteUser);

module.exports = router;
