const mongoose = require('mongoose');

var images = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
})
// list of amenities categorized
var property_images = new mongoose.Schema({

    property_id: { type: String, required: true },
    images: [images],
});

module.exports = mongoose.model('PropertyImages', property_images, 'property_images');