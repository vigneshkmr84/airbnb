const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var reviews = new mongoose.Schema({

    user_name: { type: String, required: true },
    guest_id: { type: String, required: true },
    property_id: { type: String, required: true },
    comments: { type: String, required: true },
    rating: { type: Number, required: true },

    created_at: { type: Date, required: true, default: new Date() },
});

reviews.plugin(mongoosePaginate);
// a guest can review a property only once
// reviews.index({ property_id: 1, guest_id: 1 }, { unique: true });

module.exports = mongoose.model('Reviews', reviews, 'reviews');
