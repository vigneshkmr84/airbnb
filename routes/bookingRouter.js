const express = require('express');
const bookingController = require('../controllers/bookingController');
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const router = express.Router();
var jsonParser = bodyParser.json();



// Assignment 4 API's 
router.get('/bookings/:id', jsonParser, bookingController.getBookingById);
router.post('/bookings', jsonParser, bookingController.createBooking);
router.get('/bookings', jsonParser, bookingController.getBookings);
router.delete('/bookings/:id', jsonParser, bookingController.cancelBooking);

module.exports = router;
