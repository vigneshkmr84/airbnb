const express = require('express');
const propertyController = require('../controllers/propertyController');
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const router = express.Router();
var jsonParser = bodyParser.json({ limit: '50mb' });

/* router.post('/property', jsonParser, propertyController.listAProperty);
router.delete('/property/:id', jsonParser, propertyController.deleteProperty);
router.get('/property', jsonParser, propertyController.getPropertyBasedOnQuery);
router.get('/property/:id/images', jsonParser, propertyController.getPropertyImages);

router.get('/search', jsonParser, propertyController.searchQuery); */

router.post('/property', jsonParser, authenticateToken, propertyController.listAProperty);
router.delete('/property/:id', jsonParser, authenticateToken, propertyController.deleteProperty);
router.get('/property', jsonParser, authenticateToken, propertyController.getPropertyBasedOnQuery);

router.get('/property/:id/images', authenticateToken, jsonParser, propertyController.getPropertyImages);
router.post('/property/:id/images', authenticateToken, jsonParser, propertyController.postPropertyImages);

// router.get('/search', jsonParser, authenticateToken, propertyController.searchQuery);

module.exports = router;
