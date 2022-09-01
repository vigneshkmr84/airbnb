const bson = require('bson');
var propertyModel = require('../model/property');
var propertyAccessModel = require('../model/property_access');

const listAProperty = async (req, res) => {
    console.log("Inside Creating a new property.");

    let body = req.body;
    var newProperty = new propertyModel(body);
    let id = null;
    try{
        await newProperty.save(function(err,doc) {
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
};


const deleteProperty = async (req, res) => {
    try{
        let id = req.params.id;
        console.log("Deleting property by id : " + id);
        await propertyModel.deleteOne({_id: id});
        console.log("Deleted Successfully.");
        res.status(200).send("Deleted Successfully.");
    }catch(e){
        console.log("Error occurred during deleting property " + e);
        res.status(500).send("Internal Server Error.");
    }

};

const getPropertyBasedOnQuery = async (req, res) => {
    //let id = req.params.id
    let query = req.query;

    //console.log("Get Property by Id : " + id + " and property booked status : " + isBooked);
    console.log(query);
    await propertyModel.find(query, (err, found) => {
        console.log("Total Elements found : " + found.length);
        if (!err) {
            res.status(200).send(found);
        }else {
            console.log(err);
            res.status(500).send("Internal Server Error Occurred.")
        }
    }).clone().catch(err => console.log("Error occured, " + err));
 };

 module.exports={getPropertyBasedOnQuery, listAProperty, deleteProperty,};
