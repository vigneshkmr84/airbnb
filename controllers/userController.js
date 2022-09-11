const bson = require('bson');
const crypto = require('crypto')

var userModel = require('../model/users');
var propertyModel = require('../model/property');

const jsonResponse = (response, status) => {
    return JSON.stringify({ status: status, message: response });
}

const Internal_Server_Error = jsonResponse("Internal Server Error.", 500);



const login = (req, res) => {
    console.log("Inside Login method.");

    let password, userName;
    // username can be both emailid / password
    // console.log(req.body);
    try {
        userName = req.body.userName;
        console.log(userName);
        password = req.body.password;
    } catch (e) {
        console.error("Exception occurred in reading login details : " + e);
        res.status(400).send(jsonResponse("Missing Credentials", 400));
    }

    userModel.find({
        $and: [
            {
                $or: [
                    { "email_id": userName },
                    { "phone_no": userName }
                ]
            },
            {
                "password": password
            }
        ]
    }, (err, found) => {
        if (!err) {
            if (found.length == 1) {
                console.log("Successful user login");
                res.status(200).send(jsonResponse(JSON.stringify({ token: "xxxx" }), 200)); // ??? CHECK HERE

            } else if (found.length == 0) {
                console.log("UserName / Password does not match")
                res.status(401).send(jsonResponse("Invalid UserName / Password", 401));
            }
            // this else is not needed 
            // as unique constraint is made on email_id & phone_no
            /* else{
                console.log("Total users found : " + found.length);
                console.log("Too many users with same phone no / email id")
                res.status(404).send(jsonResponse("User already registered with same phone no / email id", 404));
            } */

        } else {
            console.log("UserName / Password does not match");
            res.status(500).send(Internal_Server_Error);
        }
    }).clone().catch(err => console.log("Error occured, " + err));
}

const signup = (req, res) => {
    console.log("Inside user signup");
    body = req.body;

    var newUser = new userModel(body);
    newUser.password = crypto.createHash('md5').update(newUser.password).digest('hex');

    let id = null;
    try {
        newUser.save(function (err, doc) {
            if (!err) {
                id = doc._id;
                console.log("New Inserted ID : " + id);
                res.status(200).send(jsonResponse("Successfully created", 200));
            } else {
                console.error("Error occurred in creating user : " + err);
                res.status(500).send(jsonResponse("Error occurred in creating user", 500));
            }
        });

    } catch (e) {
        console.error("Error occurred while making Insert " + e)
        res.status(500).send(Internal_Server_Error);
    }
}


// Convert a Guest to Host
const changeUserToHost = (req, res) => {

    let id = req.params.id;
    console.log("Changing user : " + id + " to host");
    let query = { _id: new bson.ObjectId(id) };
    let updates = { "is_host": true };

    try {
        userModel.findOneAndUpdate(query, updates);
        console.log("Successfully Changed to Host");
        res.status(200).send(jsonResponse("Successfully Changed to Host", 200));
    } catch (e) {
        console.error("Error occurred while making Insert " + e)
        res.status(500).send(Internal_Server_Error);
    }
};

// delete existing user
const deleteUser = (req, res) => {
    let id = req.params.id;
    console.log("Deleting user : " + id);
    try {
        userModel.deleteOne({ _id: new bson.ObjectId(id) });
        console.log("Successfully deleted user");
        res.status(200).send("Successfully Deleted", 200);
    } catch (e) {
        console.error("Error occurred while making Insert " + e)
        res.status(500).send(Internal_Server_Error);
    }
};

// get all users
const getAllUsers = async (req, res) => {
    console.log("Get All users");

    await userModel.find({}, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.status(200).send(jsonResponse(found, 200));
        } else {
            console.log(err);
            res.status(500).send(Internal_Server_Error)
        }
    }).clone().catch(err => console.log("Error occured, " + err));
};

// get only user main information
// excluding payment details, favourites, password
const getUserById = async (req, res) => {
    let id = req.params.id
    console.log("Get User by specific Id : " + id);
    let query = { _id: new bson.ObjectId(id) };
    await userModel.findOne(query, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.status(200).send(jsonResponse(found, 200));
        } else {
            console.log(err);
            res.status(500).send(Internal_Server_Error)
        }
    })
        // do not show critical information in main page.
        .select({ password: 0, bank_details: 0, favourites: 0 })
        .clone()
        .catch(err => console.log("Error occured, " + err));
};

// get only payment details
const getUserPaymentDetails = async (req, res) => {
    let user_id = req.params.id
    console.log("Get User Payment Details : " + user_id);
    let query = { _id: new bson.ObjectId(user_id) };
    await userModel.find(query, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.status(200).send(jsonResponse(found, 200));
        } else {
            console.log(err);
            res.status(500).send(Internal_Server_Error)
        }
    })
        // fetch only the payment details
        .select({ payment_details: 1 })
        .clone();
};

// add payment details to user by id
const addPaymentToUser = async (req, res) => {
    let user_id = req.params.id
    console.log("Add payment details to : " + user_id);
    let payment_type = req.query.type;
    let query = { _id: new bson.ObjectId(user_id) };
    let options = { upsert: true, new: true };
    let updateQuery = {};

    if (payment_type == "credit" || payment_type == "debit") {
        updateQuery = { $push: { 'payment_details.credit_card': req.body } };
    } else if (payment_type == "paypal") {
        updateQuery = { $push: { 'payment_details.paypal': req.body } };
    }

    console.log(updateQuery);
    try {
        await userModel.updateOne(
            query
            , updateQuery
            , options
        ).exec();
        res.status(200).send(jsonResponse("Updated Successfully", 200));
    } catch (e) {
        console.log("Error occured during update " + e)
        res.status(500).send(Internal_Server_Error);
    }
};

// Dynamically Update user details by id
const updateUserById = async (req, res) => {
    let user_id = req.params.id;
    let updateQuery = {};
    let body = req.body;
    let keys = Object.keys(body);
    let values = Object.values(body);

    console.log(keys);
    console.log(values);
    for (let i = 0; i < keys.length; i++)
        updateQuery[keys[i]] = values[i];

    console.log(updateQuery);

    await userModel.updateOne(
        { _id: new bson.ObjectId(user_id) }
        , { $set: updateQuery }
        , function (err, success) {
            if (err) {
                console.log("Error occurred during update : " + err);
                res.status(500).send(Internal_Server_Error);
            } else {
                console.log("Updated successfully");
                res.status(200).send(jsonResponse("Updated Successfully", 200));
            }
        }
    ).clone();
};

// will read the property id's and then query them to the 
// property collection to fetch the complete details
// if property is null, it will not be returned
// Need to work on return on reverse date added
const getFavouritesByUserId = async (req, res) => {
    let user_id = req.params.id;
    console.log("Get list of Favourite properties for user : " + user_id);
    let query = { _id: new bson.ObjectId(user_id) };
    var userData;
    try {
        userData = await userModel.findOne(query)
            .clone()
            .select({ favourites: 1, _id: 0 });

        let favourites_list = userData.favourites;
        console.log(favourites_list)
        let property_list = [];

        //  don't use forEach, it will not obey the async calls
        /* for (const property_id of favourites_list) {
            let query = { _id: new bson.ObjectId(property_id) }
            let single_property = await propertyModel.findOne(query);
            if (single_property !== null)
                property_list.push(single_property)
        } */

        let object_id_list = [];
        favourites_list.forEach(property_id => {
            object_id_list.push(new bson.ObjectId(property_id));
        })

        //console.log(object_id_list)
        var newQuery = { _id: { $in: object_id_list } }
        property_list = await propertyModel.find(newQuery);

        console.log(property_list.length)

        res.status(200).send(jsonResponse(property_list, 200));
    } catch (e) {
        console.log("Error occurred during query " + e);
        res.status(500).send(Internal_Server_Error);
    }
}

// add property to favourites list
const addToFavourites = async (req, res) => {
    let user_id = req.params.id;
    let property_id = req.body.id;
    console.log("Adding property id : " + property_id + " to favourites for user : " + user_id);
    let query = { _id: new bson.ObjectId(user_id) };
    let updates = { $push: { favourites: property_id } };

    try {
        await userModel.findOneAndUpdate(
            query,
            updates
        ).clone();

        console.log("Successfully added property to favourites");
        res.status(200).send(jsonResponse("Successfully added", 200));
    } catch (e) {
        console.error("Error occurred while making Insert " + e)
        res.status(500).send(Internal_Server_Error);
    }
};

// remove property from favourites list
const removeFromFavourites = async (req, res) => {
    let user_id = req.params.id;
    let property_id = req.body.id;
    console.log("Deleting property id : " + property_id + " to favourites for user : " + user_id);

    try {
        await userModel.updateOne(
            { _id: new bson.ObjectId(user_id) },
            { $pullAll: { favourites: [property_id] } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("success");
                }
            }).clone();

        console.log("Removed Successfully");
        res.status(200).send(jsonResponse("Removed Successfully", 200));
    } catch (e) {
        console.error("Error occurred while removing favourites " + e)
        res.status(500).send(Internal_Server_Error);
    }
};



module.exports = { login, signup, changeUserToHost, deleteUser, getAllUsers, getUserById, removeFromFavourites, addToFavourites, updateUserById, getUserPaymentDetails, addPaymentToUser, getFavouritesByUserId };
