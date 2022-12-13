const express = require('express');
const propertyController = require('../controllers/propertyController');
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const router = express.Router();
var jsonParser = bodyParser.json({ limit: '50mb' });

router.post('/properties', jsonParser, authenticateToken, propertyController.listAProperty);
router.delete('/properties/:id', jsonParser, authenticateToken, propertyController.deleteProperty);
router.get('/properties', jsonParser, authenticateToken, propertyController.getPropertyBasedOnQuery);
router.get('/:user_id/properties', jsonParser, authenticateToken, propertyController.getPropertiesByHost);

router.get('/properties/:id/images', authenticateToken, jsonParser, propertyController.getPropertyImages);
router.post('/properties/:id/images', authenticateToken, jsonParser, propertyController.postPropertyImages);

module.exports = router;
