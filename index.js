require('dotenv').config();
const cors = require('cors')

const express = require('express');
const mongoose = require("mongoose");

// routers
const healthRouter = require('./routes/healthRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const reviewRouter = require('./routes/reviewRouter');
const propertyRouter = require('./routes/propertyRouter');
const favouritesRouter = require('./routes/favouritesRouter');
const bookingRouter = require('./routes/bookingRouter');
const searchRouter = require('./routes/searchRouter');



var app = express();

// Function to create database connection
async function create_connection() {
    console.log("Creating mongodb Connection");
    try {
        let connection_string = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_CONNECTION + "/" + process.env.DB + "?authMechanism=DEFAULT";
        //console.log(connection_string);
        await mongoose.connect(connection_string);
    } catch (e) {
        console.error("Exception occurred during connection " + e);
        process.exit(1);
    }
}

console.log("Starting Airbnb Application");
console.log("Current timezone : " + Intl.DateTimeFormat().resolvedOptions().timeZone);
create_connection();
var conn = mongoose.connection;
conn.on('connected', function () {
    console.log('Database is connected Successfully.');

});
conn.on('disconnected', function () {
    console.log('Database is disconnected.');
})
conn.on('error', console.error.bind(console, 'connection error:'));

app.use(cors());
app.use(healthRouter, userRouter, adminRouter, reviewRouter, propertyRouter, favouritesRouter, bookingRouter, searchRouter);
app.listen(3000);