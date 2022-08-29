require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
//const bodyParser = require('body-parser')

// routers
const healthRouter = require('./routes/healthRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const reviewRouter = require('./routes/reviewRouter');
const propertyRouter = require('./routes/propertyRouter');
const favouritesRouter = require('./routes/favouritesRouter');
const bookingRouter = require('./routes/bookingRouter');


// var hostBankDetails = require('./model/host_bank_details');
// var guestCardDetails = require('./model/guest_card_details');


var app = express();
//var jsonParser = bodyParser.json()

// Function to create database connection
async function create_connection(){
    console.log("Creating mongodb Connection");
    try {
        let connection_string = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_CONNECTION + "/" + process.env.DB + "?authMechanism=DEFAULT";
        //console.log(connection_string);
        await mongoose.connect(connection_string);
    }catch(e){
        console.error("Exception occurred during connection " + e);
        process.exit(1);
    }
}

 

 // add bank details to add for host
 /* app.post('/host/addBankDetails', jsonParser, function (req, res){
    console.log("Inside Add Bank Details method");
    let body = req.body;
    console.log(body)
    var bankDetails = new hostBankDetails(body);
    let id = null;
    try{
        bankDetails.save(function(err,doc) {
            if (!err) {
                id = doc._id;
                console.log("Successfully Inserted ID : " + id);
                res.status(200).send("Successfully Inserted : " + id);
            }else{
                console.log(err);
                res.status(500).send("Error occurred during insert.");
            }
         });
        
    }catch(e){
        console.error("Error occurred while making Insert " + e);
        res.status(500).send("Internal Server Error");
    }
    
 });
  
 // Guest User add Cards
 app.post('/guest/addCard', jsonParser, function(req, res){

    console.log("Inside Add Guest Card Details method");
    let body = req.body;
    console.log(body)
    var newCard = new guestCardDetails(body);
    let id = null;
    try{
        newCard.save(function(err,doc) {
            if (!err) {
                id = doc._id;
                console.log("Successfully Inserted ID : " + id);
                res.status(200).send("Successfully Inserted : " + id);
            }else{
                console.log(err);
                res.status(500).send("Error occurred during insert.");
            }
         });

    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
 }); */

console.log("Starting Airbnb Application");
//process.env.TZ = 'America/Chicago';
console.log("Current timezone : " + Intl.DateTimeFormat().resolvedOptions().timeZone);
create_connection();
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('Database is connected Successfully.');
});
conn.on('disconnected',function(){
    console.log('Database is disconnected.');
})
conn.on('error', console.error.bind(console, 'connection error:'));

app.use(healthRouter, userRouter, adminRouter, reviewRouter, propertyRouter, favouritesRouter, bookingRouter);
app.listen(3000);