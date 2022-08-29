const mongoose = require('mongoose');

var property_access = new mongoose.Schema({
    property_id:  {type: String, required: true},   
    house_code:  {type: String, required: true},
    garage_code: {type: String, required: false},
    other_details: {type: String, required: false},
    wifi_password: {type: String, required: false},
    wifi_name: {type: String, required: false},
});

module.exports = mongoose.model('Property_access', property_access, 'property_access');
