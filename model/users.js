const mongoose = require("mongoose");

var bankDetails = new mongoose.Schema({

    bank_name: {type: String, required: true},
    account_no: {type: Number, required: true},
    swift_code: {type: String, required: true},
    created_at : {type: Date, required: true, default: new Date()},
    versionKey: false,
});

// credit / debit card details
var cardDetailsModel = new mongoose.Schema({

    guest_id: {type: String, required: true},
    card_type: {type: String, enum: ['credit', 'debit'], required: true, lowercase: true},
    card_no: {type: Number, required: true},
    cvv: {type: Number, required: true},
    expiry_date: {type: Date, required: true},
    created_at : {type: Date, required: true, default: new Date()},
    versionKey: false,
});


var paypalModel = new mongoose.Schema({
    account_name: {type: String, required: true},
    created_at: {type: Date, required: true, default: new Date()},
});

var paymentDetailsModel = new mongoose.Schema({
    credit_card: [cardDetailsModel],
    paypal: [paypalModel],
});


// User Object
var userSchema = new mongoose.Schema({

    first_name : {type: String, required: true},
    last_name : {type: String, required: true},
    email_id : {type: String, required: true, unique :true, lowercase: true},
    phone_no : {type: String, required: true, unique: true},
    gender: {type: String, required: true},
    profile_photo: {type: String, required: false}, // will be converted to Buffer or other data types

    password: {type: String, required: true},
    is_host: {type: Boolean, required: true, default: false},
    id_type: {type: String, enum: ['passport', 'driver license', 'state id card'], required: true, default: 'Passport', lowercase: true},
    id_details: {type: String, required: true},
    favourites: {type : Array, required: true},    // list of property id's
    bank_details: bankDetails,
    payment_details: paymentDetailsModel,

    created_at : {type: Date, required: true, default: new Date()},
    updated_at : {type: Date, required: true, default: new Date()},
});

module.exports = mongoose.model('Users', userSchema, 'app_user');
