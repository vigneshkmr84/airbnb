const mongoose = require('mongoose');
const bson = require('bson')

// User Object
var guestCardDetails = new mongoose.Schema({

    guest_id: {type: String, required: true},
    //host_id: {type: String, required: true},
    card_no: {type: Number, required: true},
    cvv: {type: Number, required: true},
    expiry_date: {type: Date, required: true},
    versionKey: false,
});

module.exports = mongoose.model('GuestCardDetails', guestCardDetails, 'guest_card_details');
