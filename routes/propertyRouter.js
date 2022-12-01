const express = require('express');
const propertyController = require('../controllers/propertyController');
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const router = express.Router();
var jsonParser = bodyParser.json({ limit: '50mb' });

router.post('/property', jsonParser, authenticateToken, propertyController.listAProperty);
router.delete('/property/:id', jsonParser, authenticateToken, propertyController.deleteProperty);
router.get('/property', jsonParser, authenticateToken, propertyController.getPropertyBasedOnQuery);

router.get('/property/:id/images', authenticateToken, jsonParser, propertyController.getPropertyImages);
router.post('/property/:id/images', authenticateToken, jsonParser, propertyController.postPropertyImages);

module.exports = router;
