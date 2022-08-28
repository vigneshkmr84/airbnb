const mongoose = require('mongoose');
const bson = require('bson')

var reviews = new mongoose.Schema({

          host_id:  {type: String, required: true},
          guest_id: {type: String, required: true},
          property_id: {type: String, required: true},
          comments: {type: String, required: true},
          rating: {type: Number, required: true},
});

// a guest can review a property only once
reviews.index({property_id : 1, guest_id : 1}, { unique : true});

module.exports = mongoose.model('Reviews', reviews, 'reviews');