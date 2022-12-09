const mongoose = require('mongoose');

// list of amenities categorized
var property_amenities = new mongoose.Schema({

    category: { type: String, required: true },
    amenities: { type: Array, required: true },
    _id: false,
});

// protected details that will be shared only for booked people
var property_access = new mongoose.Schema({
    house_code: { type: String, required: true },
    garage_code: { type: String, required: false },
    other_details: { type: String, required: false },
    wifi_password: { type: String, required: false },
    wifi_name: { type: String, required: false },
});

// property address
var property_address = new mongoose.Schema({
    street: { type: String, required: true },
    houst_no: { type: String, required: true },
    county: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
    _id: false,
});

// Property Object
var property = new mongoose.Schema({

    host_id: { type: String, required: true },
    name: { type: String, required: true },
    // a beautiful pent house  or a fantastic lake view house
    one_line_description: { type: String, required: true, default: 'A beautiful property' },
    // villa, pool house, pent house, beach facing, 
    house_type: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    is_active: { type: Boolean, required: true, default: true },
    cost_per_day: { type: Number, required: true },
    cleaning_cost: { type: Number, required: true, default: 0 },
    service_cost: { type: Number, required: true, default: 0 },

    amenities: { type: [property_amenities], required: true, default: [] },

    address: property_address,
    avg_rating: { type: Number, required: true, default: 0 },
    guests: { type: Number, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    checkin_time: { type: Number, required: true },
    checkout_time: { type: Number, required: true },
    cancellation_policy: { type: String, required: true },
    protected_details: property_access,
    house_rules: { type: Array, required: false },

    created_at: { type: Date, required: true, default: new Date() },
    updated_at: { type: Date, required: true, default: new Date() },
    img: { type: String, required: false },

    versionKey: false,
});

module.exports = mongoose.model('Property', property, 'property');
