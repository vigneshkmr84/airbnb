require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const bson = require('bson');


var userModel = require('./model/users');
var hostBankDetails = require('./model/host_bank_details');
var guestCardDetails = require('./model/guest_card_details');
var property = require('./model/property');
var reviews = require('./model/reviews');


var bodyParser = require('body-parser')

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
    console.log("Successfully Created mongodb Connection");
}

app.get('/health', function(req, res){
    console.log("Health OK")
    res.send("Health OK");
 });

 app.get('/get/users/:id', function(req, res){
    res.send('The id you specified is ' + req.params.id);
    //console.log("Total Elements found : " + found.length);
 });

 app.post('/login',jsonParser, function(req, res){
    console.log("Login method ");

    let email_id = req.body.email_id;
    let phone_no = req.body.phone_no;
    let password = req.body.password;

    userModel.find({$and: [
        {
            $or: [
                { "email_id": email_id },
                { "phone_no": phone_no }
            ]
        },
        {
            "password": password
        }
    ]}, (err, found) => {    
        if (!err) {
            if ( found.length == 1){
                console.log("Successful user login");
                res.status(200).send({"token" : "XXXX"});
            }else if ( found.length == 0){
                console.log("UserName / Password does not match")
                res.status(401).send("UserName / Password does not match");
            }
            // this check condition is not needed 
            // as unique constraint is made on email_id & phone_no
            else{
                console.log("Total users found : " + found.length);
                console.log("Too many users with same phone no / email id")
                res.status(404).send("Too many users with same phone no / email id");
            }
            
        }else {
            console.log("UserName / Password does not match");
            res.status(500).send("Internal Server Error.")
        }
    }).clone().catch(err => console.log("Error occured, " + err));
    
 });

 // create new users
 app.post('/signup', jsonParser, function(req, res){
    body = req.body;
    console.log(body);

    var newUser = new userModel(body)
    let id = null;
    try{
        newUser.save(function(err,doc) {
            if (!err) {
                id = doc._id;
                console.log("Inserted ID : " + id);
                res.status(200).send("Inserted Successfully : " + id);
            }
         });
        
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
 });

 // Convert a Guest to Host
 app.post('/users/toHost/:id', jsonParser, function(req, res){

    let id = req.params.id;
    console.log("Changing user : " + id + " to host");
    let u = userModel.find({ _id: new bson.ObjectId('6307c23526ac686a5faa8dc1')});
    //console.log(u);
    try{
        userModel.findOneAndUpdate({ _id: new bson.ObjectId('6307c23526ac686a5faa8dc1')}, {"is_host": true});
        console.log("Successfully Changed to Host");
        res.status(200).send("Successfully Changed to Host");
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
 });

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

 // get a specific property details
 app.get('/property/:property_id', jsonParser, function (req, res){
    console.log("Get All Host properties");
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
 
 // guest adding a review to property (only once via schema constraint)
 app.post('/guest/review', jsonParser, function(req, res){

    console.log("Inside Add a review API");
    let body = req.body;
    console.log(body)
    var newReview = new reviews(body);
    let id = null;
    try{
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

 app.get('/get/users', function (req, res){
    console.log("Inside get all users method");
    
    userModel.find({}, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.send(found);
        }else {
            console.log(err);
            res.status(500).send("Internal Server Error Occurred.")
        }
    }).clone().catch(err => console.log("Error occured, " + err));
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

app.listen(3000);