const express = require('express');
const bookingController = require('../controllers/bookingController');
const bodyParser = require('body-parser');
const { authenticateToken } = require('../utils/jwtGenerator');

const router = express.Router();
var jsonParser = bodyParser.json();

router.get('/booking/:id', jsonParser, bookingController.getBookings);
router.post('/booking', jsonParser, bookingController.createBooking);
router.delete('/booking/:id', jsonParser, bookingController.cancelBooking);

module.exports = router;
