const mongoose = require("mongoose");


var bookingModel = mongoose.Schema({
    user_id : {type: String, required: true},
    property_id : {type: String, required: true},
    // id that's used to pay for the booking
    payment_details_id : {type: String, required: true}, 

    start_date : {type: Date, required: true},
    end_date : {type: Date, required: true},
    canceled : {type: Boolean, required: true, default: false},
    total_cost : {type: Number, required: true},
    taxes : {type: Number, required: true},
    no_of_people : {type: Number, required: true},
    message_to_host : {type: String, required: false},
    // guests: {type: [guest_list], required: true, default: []},
    
    created_at : {type: Date, required: true, default: new Date()},
});

module.exports = mongoose.model('Bookings', bookingModel, 'bookings');
