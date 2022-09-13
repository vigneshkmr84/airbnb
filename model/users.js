const mongoose = require("mongoose");

// svg image for better resizing option
var default_photo = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIFdyaXR0ZW4gYnkgVHJlZXIgKGdpdGxhYi5jb20vVHJlZXIpIC0tPg0KPHN2ZyANCgl2ZXJzaW9uPSIxLjEiIA0KCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgDQoJeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIA0KCXdpZHRoPSI2MDAiIA0KCWhlaWdodD0iNjAwIg0KCWZpbGw9IndoaXRlIj4NCg0KICA8dGl0bGU+QWJzdHJhY3QgdXNlciBpY29uPC90aXRsZT4NCg0KICA8ZGVmcz4NCiAgICA8Y2xpcFBhdGggaWQ9ImNpcmN1bGFyLWJvcmRlciI+DQogICAgICA8Y2lyY2xlIGN4PSIzMDAiIGN5PSIzMDAiIHI9IjI4MCIgLz4NCiAgICA8L2NsaXBQYXRoPg0KICAgIDxjbGlwUGF0aCBpZD0iYXZvaWQtYW50aWFsaWFzaW5nLWJ1Z3MiPg0KCSAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iNDk4IiAvPg0KICAgIDwvY2xpcFBhdGg+DQogIDwvZGVmcz4NCiAgDQogIDxjaXJjbGUgY3g9IjMwMCIgY3k9IjMwMCIgcj0iMjgwIiBmaWxsPSJibGFjayIgY2xpcC1wYXRoPSJ1cmwoI2F2b2lkLWFudGlhbGlhc2luZy1idWdzKSIgLz4NCiAgPGNpcmNsZSBjeD0iMzAwIiBjeT0iMjMwIiByPSIxMTUiIC8+DQogIDxjaXJjbGUgY3g9IjMwMCIgY3k9IjU1MCIgcj0iMjA1IiBjbGlwLXBhdGg9InVybCgjY2lyY3VsYXItYm9yZGVyKSIgLz4NCjwvc3ZnPg=="
const payment_types_enum = ['credit', 'debit', 'amex', 'discover', 'visa', 'mastercard'];

var bankDetails = new mongoose.Schema({

    bank_name: { type: String, required: true },
    account_no: { type: Number, required: true },
    swift_code: { type: String, required: true },
    created_at: { type: Date, required: true, default: new Date() },
    versionKey: false,
});

// credit / debit card details
var cardDetailsModel = new mongoose.Schema({

    guest_id: { type: String, required: true },
    nick_name: { type: String, required: true },
    card_type: { type: String, enum: payment_types_enum, required: true, lowercase: true },
    card_no: { type: Number, required: true },
    cvv: { type: Number, required: true },
    expiry_date: { type: Date, required: true },
    created_at: { type: Date, required: true, default: new Date() },
    versionKey: false,
});


var paypalModel = new mongoose.Schema({
    account_name: { type: String, required: true },
    created_at: { type: Date, required: true, default: new Date() },
});

var paymentDetailsModel = new mongoose.Schema({
    credit_card: [cardDetailsModel],
    paypal: [paypalModel],
});

var hostDetailsModel = new mongoose.Schema({
    languages: { type: Array, required: true, default: ['English'] },
    description: { type: String, required: true },
    is_superhost: { type: Boolean, required: true, default: false },
})
// User Object
var userSchema = new mongoose.Schema({

    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    /* email_id : {type: String, required: true, unique :true, lowercase: true},
    phone_no : {type: String, required: true, unique: true}, */

    // one of email_id / phone_no should be present
    email_id: {
        type: String, unique: true, lowercase: true,
        required: function () {
            return !this.phone_no;
        }
    },
    phone_no: {
        type: String, unique: true,
        required: function () {
            return !this.email_id;
        }
    },
    profile_photo: { type: String, required: false, default: default_photo }, // will be converted to Buffer or other data types

    password: { type: String, required: true },
    is_host: { type: Boolean, required: true, default: false },
    id_type: { type: String, enum: ['passport', 'driver license', 'state id card'], required: true, default: 'Passport', lowercase: true },
    id_details: { type: String, required: true },
    favourites: { type: Array, required: true, deafult: [] },    // list of property id's
    // host_is_superhost: { type: Boolean, required: false, default: false },
    host_details: { type: hostDetailsModel },
    bank_details: bankDetails,
    payment_details: paymentDetailsModel,

    created_at: { type: Date, required: true, default: new Date() },
    updated_at: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model('Users', userSchema, 'app_user');


// module.exports = {payment_types_enum};