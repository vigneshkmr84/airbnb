const mongoose = require('mongoose');
const bson = require('bson')

// User Object
var hostBankDetails = new mongoose.Schema({

    host_id: {type: String, required: true, unique: true},
    //host_id: {type: String, required: true},
    bank_name: {type: String, required: true},
    account_no: {type: Number, required: true},
    swift_code: {type: String, required: true},
    versionKey: false,
});

module.exports = mongoose.model('HostBankDetails', hostBankDetails, 'host_bank_details');
