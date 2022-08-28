const mongoose = require("mongoose");

// User Object
var userSchema = new mongoose.Schema({

    first_name : {type: String, required: true},
    last_name : {type: String, required: true},
    email_id : {type: String, required: true, unique :true, lowercase: true},
    phone_no : {type: String, required: true, unique: true},
    password: {type: String, required: true},
    gender: {type: String, required: true},
    is_host: {type: Boolean, required: true, default: false},
});

module.exports = mongoose.model('Users', userSchema, 'app_user');
