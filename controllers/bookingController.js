const bson = require('bson');

var bookingModel = require('../model/bookings');
var propertyModel = require('../model/property');
const { findPropertyById } = require('./propertyController');

const jsonResponse = (response, status) => {
    return { status: status, message: response };
}

const Internal_Server_Error = jsonResponse("Internal Server Error.", 500);


// based on the query parameter ?past=true/false it fetches the history and future bookings
// if nothing is passed all bookings are fetched
const getBookings = async (req, res) => {

    try {
        let past = req.query.past;
        let query = {};
        console.log(past);
        let user_id = req.query.user_id;
        console.log("Get bookings for user : " + user_id);
        if (typeof past === 'undefined') {
            console.log("Fetching All bookings");
            query = { user_id: user_id };
        } else if (past === 'true') {
            console.log("Fetching past bookings");
            query = { user_id: user_id, start_date: { $lte: new Date().toISOString() } };
        } else if (past === 'false') {
            console.log("Fetching Future bookings");
            query = { user_id: user_id, start_date: { $gte: new Date().toISOString() } };
        }
        console.log(query);
        let allBookingDetails = await bookingModel.find(query);

        var updatedBooking = [];
        await Promise.all(allBookingDetails.map(async function (b) {
            let p = await findPropertyById(b.property_id)
            let t = { ...b._doc, property_details: p }
            updatedBooking.push(t)
            return t
        }))

        // console.log(updatedBooking)
        console.log("Total fetched bookings : " + updatedBooking.length);
        res.status(200).send(jsonResponse(updatedBooking, 200));
    } catch (e) {
        console.log("Error occurred during fetch : " + e);
        res.status(500).send(Internal_Server_Error);
    }
};


async function getAllActiveBookingsForProperty(_id) {
    let bookings = await bookingModel.find({ property_id: _id }, (err, docs) => {
        if (err) {
            console.log('Error occurred in fetching bookings :', err)
            return null
        } else {
            return docs;
        }
    }).clone();

    // console.log('total size : ', bookings.length);
    return bookings;
}

// start_date: "2022-11-08T21:10:00.000+00:00"
// end_date: "2022-11-10T22:00:00.000+00:00"
async function validateBooking(property_id, new_start_date, new_end_date) {
    console.log('Validating Booking');
    // console.log(new_start_date, new_end_date);
    new_start_date = new Date(new_start_date).getTime();
    new_end_date = new Date(new_end_date).getTime();

    /* console.log(new_start_date);
    console.log(new_end_date); */

    let flag = 0;
    let existing_bookings = await getAllActiveBookingsForProperty(property_id);

    existing_bookings.forEach(b => {
        let start_date = new Date(b.start_date).getTime();
        let end_date = new Date(b.end_date).getTime();
        // console.log(start_date);
        // console.log(end_date);
        if ((new_start_date >= start_date && new_start_date <= end_date)
            || (new_end_date >= start_date && new_end_date <= end_date)) {
            console.log('Booking clashes with id : ', b._id);
            flag = 1;
        }
    })

    if (flag === 1)
        return false

    return true;
}

// reserve a booking
const createBooking = async (req, res) => {
    console.log("Reserve a booking");
    let body = req.body;
    let user_id = req.query.user_id
    body["user_id"] = user_id;
    // console.log(body)
    try {

        // Logic
        // will append the start time and end time of the property listed 
        // with the start date and end date of the booking 
        // will be easy to calculate when on exit
        let property = await propertyModel.findOne({ _id: new bson.ObjectId(body.property_id) });
        /* body.start_date = getDateWithTime(property.checkin_time, body.start_date);
        body.end_date = getDateWithTime(property.checkout_time, body.end_date); */
        // console.log(property)
        body.start_date = getDateWithTime(property.checkin_time, body.start_date);
        body.end_date = getDateWithTime(property.checkout_time, body.end_date);
        calculated_cost = calculateTotalCost(property, body.start_date, body.end_date);
        body.total_cost = calculated_cost[0];
        body.taxes = calculated_cost[1];
        body.user_id = body.user_id;
        body.no_of_people = Number(body.no_of_people)
        console.log(1)
        if (await validateBooking(body.property_id, body.start_date, body.end_date) === false) {
            console.log('Property Already booked');
            res.status(500).send(jsonResponse("Dates already taken", 500));
        }
        else {
            console.log(2)
            var newReservation = new bookingModel(body);
            console.log(newReservation)
            newReservation.save((err, doc) => {
                if (!err) {
                    id = doc._id;
                    console.log("Booking ID : " + id);
                    res.status(200).send(jsonResponse("Booked Successfully : " + id, 200));
                } else {
                    console.error("Error occurred in reservation : ", err);
                    res.status(500).send(jsonResponse("Unable to Reserve", 500));
                }
            })
            //.clone();
        }

    } catch (e) {
        console.log("Error in Reservation " + e);
        res.status(500).send(Internal_Server_Error);
    }
};

const getDateWithTime = (totalMinutes, newDate) => {

    let hours = 0, minutes = 0;
    hours = Math.floor(totalMinutes / 60);
    minutes = totalMinutes % 60;
    newDate = new Date(newDate);
    newDate.setHours(hours, minutes, 0);
    return newDate;
}

//const calculateTotalCost = (start_date, end_date, property_id) => {
const calculateTotalCost = (property, start_date, end_date) => {

    start_date = new Date(start_date)
    end_date = new Date(end_date)

    days_count = Math.ceil((end_date.getTime() - start_date.getTime()) / (1000 * 3600 * 24));
    total_cost = property.cost_per_day * days_count + property.service_cost + property.cleaning_cost;
    // tax calculation logic = min of 150$ or 5% of the total cost 
    taxes = Math.min(150, total_cost * 0.05);
    total_cost = total_cost + taxes;
    console.log("Total Cost for " + days_count + " days : " + total_cost);
    return [total_cost, taxes];
}

// cancel existing booking
// only if the current time is less than 48 hours of start time
// need to take the time reservation starts
const cancelBooking = async (req, res) => {
    let bookingId = req.params.id;
    console.log("Cancel Existing booking : " + bookingId);
    let filter = { _id: new bson.ObjectId(bookingId) };
    let update = { canceled: true };
    try {
        let booked = await bookingModel.findOne({ _id: new bson.ObjectId(bookingId) });
        //console.log(booked);
        if (isValidCancelation(booked.start_date)) {
            await bookingModel.findOneAndUpdate(
                filter,
                update,
                { new: true }
            );
            console.log("Canceled Successfully");
            res.status(200).send(jsonResponse("Canceled Successfully", 200));
        } else {
            console.log("Cancelation time is less than 48 hours.");
            res.status(400).send(jsonResponse("Cancelation time is less than 48 hours.", 400));
        }

    } catch (e) {
        console.log("Error in cancelling booking " + e);
        res.status(500).send(Internal_Server_Error);
    }
};


// will return true if the current date time
// is greater than 48 hours to start of the trip
// else will return false
const isValidCancelation = (start_date) => {
    let current_date = new Date();
    current_date.setDate(current_date.getDate() + 2);
    console.log(current_date);
    console.log(start_date);
    console.log(parseInt((start_date - current_date) / (1000 * 60 * 60 * 24)));

    if (start_date > current_date)
        return true;

    return false;
}

const getBookingById = async (req, res) => {
    try {
        let id = req.params.id;
        let query = { _id: new bson.ObjectId(id) };

        console.log(query);
        let booking_details = await bookingModel.findOne(query);

        var updatedBooking = [];

        let p = await findPropertyById(booking_details.property_id)
        let t = { ...booking_details._doc, property_details: p }
        updatedBooking.push(t)

        res.status(200).send(jsonResponse(updatedBooking, 200));
    } catch (e) {
        console.log("Error occurred during fetch : " + e);
        res.status(500).send(Internal_Server_Error);
    }
}
module.exports = { getBookings, createBooking, cancelBooking, getBookingById };
