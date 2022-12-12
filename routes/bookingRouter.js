const express = require('express');
const bookingController = require('../controllers/bookingController');
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const router = express.Router();
var jsonParser = bodyParser.json();

router.get('/bookings/:id', jsonParser, authenticateToken, bookingController.getBookings);
router.post('/bookings', jsonParser, authenticateToken, bookingController.createBooking);
router.put('/bookings/:id', jsonParser, authenticateToken, bookingController.updateBooking);
router.delete('/bookings/:id', jsonParser, authenticateToken, bookingController.cancelBooking);

module.exports = router;
