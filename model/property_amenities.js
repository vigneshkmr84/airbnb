const mongoose = require('mongoose');
const bson = require('bson')

// User Object
var property_amenities = new mongoose.Schema({

//    property_id : {type: String, required: true},
      category:  {type: String, required: true},
      amenities: {type: Array, required: true},

});



module.exports = mongoose.model('property_amenities', property_amenities, 'property_amenities');