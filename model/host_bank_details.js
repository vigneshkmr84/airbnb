const mongoose = require('mongoose');

// Host Bank Details
var hostBankDetails = new mongoose.Schema({

    host_id: {type: String, required: true, unique: true},
    bank_name: {type: String, required: true},
    account_no: {type: Number, required: true},
    swift_code: {type: String, required: true},
    created_at : {type: Date, required: true, default: new Date()},
    versionKey: false,
});

module.exports = mongoose.model('HostBankDetails', hostBankDetails, 'host_bank_details');
