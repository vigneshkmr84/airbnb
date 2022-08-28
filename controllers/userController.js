const bson = require('bson');

var userModel = require('../model/users');

const login=(req, res, next) => {
    console.log("Login method.");

    let email_id, phone_no, password ;
    // username can be both emailid / password
    try{
        email_id = req.body.user_name ;
        phone_no = req.body.user_name ;
        password = req.body.password;
    }catch(e){
        console.error("Exception occurred in reading login details : " + e);
        res.status(400).send("Credentials missing");
    }
    
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

const signup=(req, res, next) => {
    console.log("Inside user signup");
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
}


// Convert a Guest to Host
const changeUserToHost = (req, res, next) => { 

    let id = req.params.id;
    console.log("Changing user : " + id + " to host");

    try{
        userModel.findOneAndUpdate({ _id: new bson.ObjectId(id)}, {"is_host": true});
        console.log("Successfully Changed to Host");
        res.status(200).send("Successfully Changed to Host");
    }catch(e){
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
 };

// delete existing user
 const deleteUser = (req, res, next) => {
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

 const getAllUsers = (req, res, next) => {
    console.log("Get All users");

    userModel.find({}, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.send(found);
        }else {
            console.log(err);
            res.status(500).send("Internal Server Error Occurred.")
        }
    }).clone().catch(err => console.log("Error occured, " + err));
 };

 const getSpecificId = (req, res, next) => {
    let id = req.params.id
    console.log("Get User by specific Id : " + id);

    userModel.find({ _id: new bson.ObjectId(id)}, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.send(found);
        }else {
            console.log(err);
            res.status(500).send("Internal Server Error Occurred.")
        }
    }).clone().catch(err => console.log("Error occured, " + err));
 };
module.exports={login, signup, changeUserToHost, deleteUser, getAllUsers, getSpecificId};
