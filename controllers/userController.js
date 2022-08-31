const bson = require('bson');

var userModel = require('../model/users');

const login=(req, res) => {
    console.log("Inside Login method.");

    let password, user_name;
    // username can be both emailid / password
    try{
        user_name = req.body.user_name;
        password = req.body.password;
    }catch(e){
        console.error("Exception occurred in reading login details : " + e);
        res.status(400).send("Missing Credentials.");
    }
    
    userModel.find({$and: [
        {
            $or: [
                { "email_id": user_name },
                { "phone_no": user_name }
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
            // this else is not needed 
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
}

const signup=(req, res) => {
    console.log("Inside user signup");
    body = req.body;

    var newUser = new userModel(body);
    let id = null;
    try{
        newUser.save(function(err,doc) {
            if (!err) {
                id = doc._id;
                console.log("Inserted ID : " + id);
                res.status(200).send("Inserted Successfully : " + id);
            }else{
            console.error("Error occurred in creating user : " + err);
            res.status(500).send("Error occurred in creating user");
            }
         });
        
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
}


// Convert a Guest to Host
const changeUserToHost = (req, res) => { 

    let id = req.params.id;
    console.log("Changing user : " + id + " to host");
    let query = { _id: new bson.ObjectId(id) };
    let updates = { "is_host": true };

    try{
        userModel.findOneAndUpdate(query, updates);
        console.log("Successfully Changed to Host");
        res.status(200).send("Successfully Changed to Host");
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
 };

// delete existing user
 const deleteUser = (req, res) => {
    let id = req.params.id;
    console.log("Deleting user : " + id);
    try{
        userModel.deleteOne({ _id: new bson.ObjectId(id)});
        console.log("Deleted user");
        res.status(200).send("Deleted user");
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
 };

 // get all users
 const getAllUsers = async (req, res) => {
    console.log("Get All users");

    await userModel.find({}, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.send(found);
        }else {
            console.log(err);
            res.status(500).send("Internal Server Error Occurred.")
        }
    }).clone().catch(err => console.log("Error occured, " + err));
 };

 // get only user main information
 // excluding payment details, favourites, password
 const getUserById = async (req, res) => {
    let id = req.params.id
    console.log("Get User by specific Id : " + id);
    let query = { _id: new bson.ObjectId(id) };
    await userModel.find( query, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.status(200).send(found);
        }else {
            console.log(err);
            res.status(500).send("Internal Server Error Occurred.")
        }
    })
    // do not show critical information in main page.
    .select({ password: 0, bank_details: 0, favourites: 0})
    .clone()
    .catch(err => console.log("Error occured, " + err));
 };

 // get only payment details
 const getUserPaymentDetails = async (req, res) => {
    let user_id = req.params.id
    console.log("Get User Payment Details : " + user_id);
    let query = { _id: new bson.ObjectId( user_id) };
    await userModel.find( query, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.send(found);
        }else {
            console.log(err);
            res.status(500).send("Internal Server Error Occurred.")
        }
    })
    // fetch only the payment details
    .select({ payment_details: 1})
    .clone();
 };

 // add payment details to user by id
 const addPaymentToUser = async (req, res) => {
    let user_id = req.params.id
    console.log("Add payment details to : " + user_id);
    let payment_type = req.query.type;
    let query = {_id: new bson.ObjectId(user_id)};
    let options = { upsert: true, new: true};
    let updateQuery = {};
    if ( payment_type == "credit" || payment_type == "debit"){
        updateQuery = { $push: { 'payment_details.credit_card' : req.body }};
    }else if ( payment_type == "paypal") {
        updateQuery = { $push: { 'payment_details.paypal' : req.body }};
    }
    
    console.log(updateQuery);
    try{
        await userModel.updateOne(
        query
        , updateQuery
        , options
    ).exec();
        res.status(200).send("Updated Successfully");
    }catch(e){
        console.log("Error occured during update " + e)
        res.status(500).send("Error occurred during update.");
    }
 };

 // Dynamically Update user details by id
 const updateUserById = async (req, res) => {
    let user_id = req.query.id;
    let updateQuery = {};
    let body = req.body;
    let keys = Object.keys(body);
    let values = Object.values(body);

    console.log(keys);
    console.log(values);
    for ( let i =0; i< keys.length; i++)
        updateQuery[keys[i]] = values[i];
    
    console.log(updateQuery);
    await userModel.updateOne(
        {_id: new bson.ObjectId(user_id)}
        , { $set: updateQuery}   
        , function (err , success) {
            if (err) {
                console.log("Error occurred during update : " + err);
                res.status(500).send("Error occurred during update");
            }else {
                console.log("Updated successfully");
                res.status(200).send("Updated Successfully");
            }
        }
    ).clone();
 };

 // add property to favourites list
 const addToFavourites = async (req, res) => {
    let user_id = req.params.id;
    let property_id = req.body.id;
    console.log("Adding property id : " + property_id + " to favourites for user : " + user_id);
    let query = { _id: new bson.ObjectId(user_id) };
    let updates = { $push: { favourites : property_id }};

    try{
        await userModel.findOneAndUpdate(
            query,
            updates
        ).clone();

        console.log("Successfully added property to favourites");
        res.status(200).send("Successfully added property to favourites");
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
 };

 // remove property from favourites list
 const removeFromFavourites = async (req, res) => {
    let user_id = req.params.id;
    let property_id = req.body.id;
    console.log("Deleting property id : " + property_id + " to favourites for user : " + user_id);

    try{
        await userModel.updateOne(
            { _id: new bson.ObjectId(user_id) },
            { $pullAll: { favourites : [property_id] }},
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("success");
                }
            }).clone();

        console.log("Removed Successfully");
        res.status(200).send("Removed Successfully");
    }catch(e){
        console.error("Error occurred while removing favourites " + e)
        res.status(500).send("Internal Server Error");
    }
};



module.exports={login, signup, changeUserToHost, deleteUser, getAllUsers, getUserById, removeFromFavourites, addToFavourites, updateUserById, getUserPaymentDetails, addPaymentToUser};
