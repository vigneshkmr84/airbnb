const express = require('express');
const reviewController = require('../controllers/reviewController'); 
const bodyParser = require('body-parser');

const router  = express.Router(); 
var jsonParser = bodyParser.json();

router.post('/review', jsonParser, reviewController.create);
router.get('/review', jsonParser, reviewController.getReview);

module.exports = router;
