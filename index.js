require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const bson = require('bson');
const bodyParser = require('body-parser')

// routers
const healthRouter = require('./routes/healthRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

var userModel = require('./model/users');
var hostBankDetails = require('./model/host_bank_details');
var guestCardDetails = require('./model/guest_card_details');
var property = require('./model/property');
var reviews = require('./model/reviews');
var property_access = require('./model/property_access');




var app = express();
var jsonParser = bodyParser.json()

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
    //console.log("Successfully Created mongodb Connection");
}

 

 // add bank details to add for host
 app.post('/host/addBankDetails', jsonParser, function (req, res){
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
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
    
 });

  // host List a new property
  app.post('/host/property/list', jsonParser, function (req, res){
    console.log("Inside List a property");
    let body = req.body;
    console.log(body)
    var newProperty = new property(body);
    let id = null;
    try{
        newProperty.save(function(err,doc) {
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
 });

 // get all properties hosted by a Host
 app.get('/host/property/:host_id', jsonParser, function (req, res){
    console.log("Get All Host properties");
    let host_id = req.params.host_id;
    try{
        property.find({"host_id" : host_id}, (err, found) => {
            console.log("Total Elements found : " + found.length);
            if (!err) {
                res.send(found);
            }else {
                console.log(err);
                res.status(500).send("Internal Server Error Occurred.")
            }
        }).clone().catch(err => console.log("Error occured, " + err));
        
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
    
 });

 // get a property specific general details
 app.get('/property/:property_id', jsonParser, function (req, res){
    console.log("Get Specific property details");
    let property_id = req.params.property_id;
    try{
        property.find({"_id" : new bson.ObjectId(property_id)}, (err, found) => {
            console.log("Total Elements found : " + found.length);
            if (!err) {
                res.send(found);
            }else {
                console.log(err);
                res.status(500).send("Internal Server Error Occurred.")
            }
        }).clone().catch(err => console.log("Error occured, " + err));
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }

 });

 // For Guest get booked property details
 app.get('/property/booked/:property_id', jsonParser, function (req, res){
    console.log("Get protected property details");
    let property_id = req.params.property_id;
    try{
        property_access.find({"_id" : new bson.ObjectId(property_id)}, (err, found) => {
            console.log("Total Elements found : " + found.length);
            if (!err) {
                res.send(found);
            }else {
                console.log(err);
                res.status(500).send("Internal Server Error Occurred.")
            }
        }).clone().catch(err => console.log("Error occured, " + err));
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }

 });
 
 // guest adding a review to property (only once via schema constraint)
 app.post('/guest/review', jsonParser, function(req, res){

    console.log("Inside Add a review API");
    let body = req.body;
    console.log(body)
    var newReview = new reviews(body);
    let id = null;
    try{
        // first need to check if the property has been used by the user in the near past 
        // then only allow the user to add a review
        newReview.save(function(err,doc) {
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
 });

create_connection();
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));

app.use(healthRouter, userRouter, adminRouter);
//app.route('/admin', adminRouter);
app.listen(3000);