const mongoose = require("mongoose");

var default_photo = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAATlBMVEVHcExzfJayucZfaoijq7pVYIB0fZfj6OpVYIBVYIBVYIBVYIDZ3uJVYIDEy9NveZNVYIB9hp7n7O3n7O2Olqrn7O3n7O3n7O1VYIDn7O1jegqQAAAAGHRSTlMAG/X79lUL9/DAM4ny2Pf4pfe5i/ZONly/Kkm6AAAER0lEQVR42u2b24KjIAyG6xEVVKy2xfd/0WXdHmzryB8Mw83mYi4nX5M/ASScTnQrk6aQum7bqjLWqqptay2LJilP4a20vut2cfxpVVtbiqAQiXW+6XtFYSGSUN51ayBrNT9D2UjQ+51BsuaiLHRliFbpomRzX5Pd/5MDC4J1b7yNAaHRlTlglW6OKV8ecr8gyAMVcST66zzE+/mHgtDUhs3qxkP8rWG0iloOJVf4X2kgESTasJtO4qTfRwhh/OMEofyjBJj/rB+mKc9Ta3k+TUOfcREg/rMp75SYVyZUl08ZB0Hi9j+kat40lQ5uAkctlNrtXsw/mnAj6P1+IF3Bz3fcLwi5KxG7Halw9L++m53W9a6uvCNABv8AQeMrwAzybwkyTyG6BJDOoKUuGfgJYBAogBh8ZMCVAO8kuBKAB8Adgq0kuCoAVwCigu9KcLbATFEAVEZtiC4FkjIA5OBTh6VzDZpmkk3OVek9BIVzGctpALnzHxa0APADvIXAqYAAAGsVlMAunB1gXQhNFQNg1QukiQHwaodJGwegTeAaDAPwrEQdC0ATMhAE4J4DKANBAO45kPEAJNiGgwEs7RjpQqEAll6ESSAMwCICGRNAwhLoFQ1A9agIsC5A2ZNjO/NnJ8A0SNsRQrvChwqDtCFKK8I0mNIBUlCFOi6APtVxAepTGxegjQ9QxQWo4gOYuADmPwAIEKwVG1CEoRYjuApMoOXYAoC3c9QNSYdtSOBOiH4nfioQ9G8B4Asigg7FlKH/tT7BN4QEHaYGNo1uikkfCiccQKLHAkoOVIYDFOjBiJKDHPdvN6UJfEuObs1FjwPYbXmJ35NO7BJcTqewCkEZgj34dT7HVYjJkBKA5XCKqxAKgSIo4N/xnCACRAW5IUqAIgKgELrMECVAEoGzF5AU+PhIlVDmZXLGBDw/lVImVvaTQEvA40MlKQe7SSBVwOrGgJSDvVIkBuD5sZpSB5wAknRhwQ+wurAodQyA9d1lUf0+wNvVJaEdswG831ziIWADKIhXt9wAH1e3eAh6HoCvIQq4EJg64fc8E9oLcpYDwdYojzycAUIOpN8Ym3tHAi7H25NEgA771Hks9VIgOsk2KZ6DufQa5coG7GQknAg/zxQ2OxuD3TlCEkLbeIzz9SltiGYPodgdqN52nxO/EO0hSPJIZ0Z3v4PgGOn8HurOpm72tC2EOqGN1aLSRxHqhDZYPKRiPmbvCMTR6v6w+w8E2nB576e9HQR8vP6vEicu989p45rwwCCR+cxr3aBJL13KUfACiJH65urGSiBu9Gc+1zOf//PV66ETVxrE6Pva68IShPPlwGO340Hw//kPJRxCEH7Z/8iD8Hd/YXlz6Ykgzje2V6ceCEy//qWFkbI2CDVeT9xWXkaFxUGNl1CPry+jKxfiHMz7PQ7X23hWQmzG/Tzerr/yAj+xFBbDclgQ+0dZ19a31/P/PxlGrh0T/sJiAAAAAElFTkSuQmCC";

var bankDetails = new mongoose.Schema({

    bank_name: {type: String, required: true},
    account_no: {type: Number, required: true},
    swift_code: {type: String, required: true},
    created_at : {type: Date, required: true, default: new Date()},
    versionKey: false,
});

// credit / debit card details
var cardDetailsModel = new mongoose.Schema({

    guest_id: {type: String, required: true},
    card_type: {type: String, enum: ['credit', 'debit'], required: true, lowercase: true},
    card_no: {type: Number, required: true},
    cvv: {type: Number, required: true},
    expiry_date: {type: Date, required: true},
    created_at : {type: Date, required: true, default: new Date()},
    versionKey: false,
});


var paypalModel = new mongoose.Schema({
    account_name: {type: String, required: true},
    created_at: {type: Date, required: true, default: new Date()},
});

var paymentDetailsModel = new mongoose.Schema({
    credit_card: [cardDetailsModel],
    paypal: [paypalModel],
});


// User Object
var userSchema = new mongoose.Schema({

    first_name : {type: String, required: true},
    last_name : {type: String, required: true},
    /* email_id : {type: String, required: true, unique :true, lowercase: true},
    phone_no : {type: String, required: true, unique: true}, */
    
    // one of email_id / phone_no should be present
    email_id : {type: String, unique :true, lowercase: true, 
        required: function() {
            return !this.phone_no;
    }},
    phone_no : {type: String, unique: true,
        required: function() {
            return !this.email_id;
    }},
    profile_photo: {type: String, required: false, default: default_photo}, // will be converted to Buffer or other data types

    password: {type: String, required: true},
    is_host: {type: Boolean, required: true, default: false},
    id_type: {type: String, enum: ['passport', 'driver license', 'state id card'], required: true, default: 'Passport', lowercase: true},
    id_details: {type: String, required: true},
    favourites: {type : Array, required: true, deafult: []},    // list of property id's
    bank_details: bankDetails,
    payment_details: paymentDetailsModel,

    created_at : {type: Date, required: true, default: new Date()},
    updated_at : {type: Date, required: true, default: new Date()},
});

module.exports = mongoose.model('Users', userSchema, 'app_user');
