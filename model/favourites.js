const mongoose = require("mongoose");

var favouritesSchema = new mongoose.Schema({

    user_id: { type: String, required: true },
    favourites: { type: Array, required: true, deafult: [] },
});

module.exports = mongoose.model('Favourites', favouritesSchema, 'user_favourites');
