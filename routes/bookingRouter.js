const express = require('express');
const bookingController = require('../controllers/bookingController'); 
const bodyParser = require('body-parser');

const router  = express.Router(); 
var jsonParser = bodyParser.json();

router.get('/booking/:user_id', jsonParser, bookingController.getBookings);
router.post('/booking', jsonParser, bookingController.createBooking);
router.post('/booking/cancel/:id', jsonParser, bookingController.cancelBooking);

module.exports = router;
