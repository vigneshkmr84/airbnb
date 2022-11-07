const express = require('express');
const bookingController = require('../controllers/bookingController'); 
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const router  = express.Router(); 
var jsonParser = bodyParser.json();

router.get('/booking/:user_id', jsonParser, authenticateToken, bookingController.getBookings);
router.post('/booking', jsonParser, authenticateToken, bookingController.createBooking);
router.delete('/booking/:id', jsonParser, authenticateToken, bookingController.cancelBooking);

module.exports = router;
