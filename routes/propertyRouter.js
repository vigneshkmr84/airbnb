const express = require('express');
const propertyController = require('../controllers/propertyController'); 
const bodyParser = require('body-parser');

const router  = express.Router(); 
var jsonParser = bodyParser.json();

router.post('/property', jsonParser, propertyController.listAProperty);
router.get('/property/:id', jsonParser, propertyController.getSpecificPropertyById);
router.get('/property', jsonParser, propertyController.getListOfPropertiesByHostId);

module.exports = router;
