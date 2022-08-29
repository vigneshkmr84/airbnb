const mongoose = require('mongoose');

// Credit / Debit Card Details
var guestCardDetails = new mongoose.Schema({

    guest_id: {type: String, required: true},
    card_no: {type: Number, required: true},
    cvv: {type: Number, required: true},
    expiry_date: {type: Date, required: true},
    created_at : {type: Date, required: true, default: new Date()},
    versionKey: false,
});

module.exports = mongoose.model('GuestCardDetails', guestCardDetails, 'guest_card_details');
