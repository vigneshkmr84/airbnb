const mongoose = require('mongoose');
const bson = require('bson')
//var amenities = require('./property_amenities')

var property_amenities = new mongoose.Schema({

          category:  {type: String, required: true},
          amenities: {type: Array, required: true},
          _id : false,
});

// User Object
var property = new mongoose.Schema({

    host_id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    cost_per_day: {type: Number, required: true},
    cleaning_cost: {type: Number, required: true},
    //amenities: {type: Array, required: true},
    amenities: [property_amenities],
    avg_rating: {type: Number, required: true, default:0},
    guests: {type: Number, required: true},
    bedroom: {type: Number, required: true},
    bathroom: {type: Number, required: true},
    checkin_time: {type: String, required: true},
    checkout_time: {type: String, required: true},
    cancellation_policy: {type: String, required: true},
    //photos: {type: Array},
    versionKey: false,
});

module.exports = mongoose.model('Property', property, 'property');
