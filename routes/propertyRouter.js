const express = require('express');
const propertyController = require('../controllers/propertyController'); 
const bodyParser = require('body-parser');

const router  = express.Router(); 
var jsonParser = bodyParser.json();

router.post('/property', jsonParser, propertyController.listAProperty);
router.delete('/property/:id', jsonParser, propertyController.deleteProperty);
router.get('/property', jsonParser, propertyController.getPropertyBasedOnQuery);

module.exports = router;
