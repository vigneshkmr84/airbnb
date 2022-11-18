const express = require('express');
const bookingController = require('../controllers/bookingController');
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const router = express.Router();
var jsonParser = bodyParser.json();

router.get('/booking/:id', jsonParser, bookingController.getBookingById);
router.post('/booking', jsonParser, bookingController.createBooking);
router.get('/bookings', jsonParser, bookingController.getBookings);
router.delete('/booking/:id', jsonParser, bookingController.cancelBooking);

module.exports = router;
