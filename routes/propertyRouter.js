const express = require('express');
const propertyController = require('../controllers/propertyController'); 
const bodyParser = require('body-parser');

const router  = express.Router(); 
var jsonParser = bodyParser.json({limit: '50mb'});

router.post('/property', jsonParser, propertyController.listAProperty);
router.delete('/property/:id', jsonParser, propertyController.deleteProperty);
router.get('/property', jsonParser, propertyController.getPropertyBasedOnQuery);
router.get('/property/:id/images', jsonParser, propertyController.getPropertyImages);

router.get('/search', jsonParser, propertyController.searchQuery);

module.exports = router;
