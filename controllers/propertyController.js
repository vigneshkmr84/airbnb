const bson = require('bson');
var propertyModel = require('../model/property');
var propertyImagesModel = require('../model/propertyImages');

const jsonResponse = (response, status) => {
    return { status: status, message: response };
}

const Internal_Server_Error = jsonResponse("Internal Server Error.", 500);


const listAProperty = async (req, res) => {
    console.log("Inside Creating a new property.");

    let body = req.body;
    var newProperty = new propertyModel(body);
    let id = null;
    try {
        await newProperty.save(function (err, doc) {
            if (!err) {
                id = doc._id;
                console.log("Successfully Inserted ID : " + id);
                res.status(200).send("Successfully Inserted : " + id);
            } else {
                console.log(err);
                res.status(500).send("Error occurred during insert.");
            }
        });

    } catch (e) {
        console.error("Error occurred while making Insert " + e)
        res.status(500).send("Internal Server Error");
    }
};


const deleteProperty = async (req, res) => {
    try {
        let id = req.params.id;
        console.log("Deleting property by id : " + id);
        await propertyModel.deleteOne({ _id: id });
        console.log("Deleted Successfully.");
        res.status(200).send("Deleted Successfully.");
    } catch (e) {
        console.log("Error occurred during deleting property " + e);
        res.status(500).send("Internal Server Error.");
    }

};

// query can contain _id / host_id 
const getPropertyBasedOnQuery = async (req, res) => {
    //let id = req.params.id
    console.log("Inside get property based on query parameters");
    let query = req.query
    let sortingOrder = { created_at: -1, avg_rating: -1 }
    console.log("Query : " + JSON.stringify(query));
    console.log("Sort : " + JSON.stringify(sortingOrder))

    try {
        let propertiesList = await propertyModel.find(query)
            .sort(sortingOrder);
        console.log("Total Elements found : " + propertiesList.length);
        res.status(200).send(jsonResponse(propertiesList, 200));
    } catch (e) {
        console.log("Error occurred while fetching properties " + e);
        res.status(500).send(Internal_Server_Error);
    }
};


// Search Query yet to complete
const searchQuery = async (req, res) => {

    try {
        res.status(200)
    } catch (e) {
        res.status(500).send(Internal_Server_Error);
    }
}

// get list of property images for the given property id
const getPropertyImages = async (req, res) => {
    try {
        let property_id = req.params.id;
        console.log('Get All images for Property id : ' + property_id);
        let property_images = await propertyImagesModel.findOne({ _id: new bson.ObjectId(property_id) });
        console.log(property_images.images.length)
        console.log("got")
        res.status(200).send(jsonResponse(property_images, 200));
    } catch (e) {
        console.log('Error occurred during fetching images');
        res.status(500).send(Internal_Server_Error)
    }



}
module.exports = { getPropertyBasedOnQuery, listAProperty, deleteProperty, searchQuery, getPropertyImages };
