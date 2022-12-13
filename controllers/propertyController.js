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
    // console.log(body);
    var newProperty = new propertyModel(body);
    let id = null;
    try {
        await newProperty.save(function (err, doc) {
            if (!err) {
                id = doc._id;
                console.log("Successfully Inserted Property Id : " + id);
                res.status(200).send(jsonResponse(id));
            } else {
                console.log(err);
                res.status(500).send(Internal_Server_Error);
            }
        });

    } catch (e) {
        console.error("Error occurred while making Insert " + e)
        res.status(500).send(Internal_Server_Error);
    }
};


const deleteProperty = async (req, res) => {
    try {
        let id = req.params.id;
        console.log("Deleting property by id : " + id);
        await propertyModel.deleteOne({ _id: id });
        console.log("Deleted Successfully.");
        res.status(200).send(jsonResponse("Deleted Successfully", 200));
    } catch (e) {
        console.log("Error occurred during deleting property " + e);
        res.status(500).send(Internal_Server_Error);
    }

};

// query can contain _id / host_id 
const getPropertyBasedOnQuery = async (req, res) => {

    console.log("Inside get property based on query parameters");
    let query = req.query
    let sortingOrder = { created_at: -1, avg_rating: -1 }
    console.log("Query : " + JSON.stringify(query));

    console.log("Sort : " + JSON.stringify(sortingOrder))
    query["is_active"] = true;
    console.log(typeof (query))
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


const findPropertyById = async (_id) => {
    return await propertyModel.findById(new bson.ObjectId(_id));
}

// Search Query
const searchProperty = async (req, res) => {
    console.log('Inside Search...');
    let inputQuery = req.params.query;
    console.log('Input Query : ' + inputQuery);
    let searchQuery = { $or: [{ 'location': new RegExp(inputQuery, "i") }, { 'name': new RegExp(inputQuery, "i") }] };
    console.log('Search Query ' + JSON.stringify(searchQuery));
    try {
        let searchResults = await propertyModel.find(searchQuery);
        console.log('Total Matching Results :' + searchResults.length)
        res.status(200).send(jsonResponse(searchResults, 200));
    } catch (e) {
        console.log('Internal Server Error occurred : ' + e);
        res.status(500).send(Internal_Server_Error);
    }
}

// get list of property images for the given property id
const getPropertyImages = async (req, res) => {
    try {
        let property_id = req.params.id;
        console.log('Get All images for Property id : ' + property_id);
        let property_images = await propertyImagesModel.find({ property_id: new bson.ObjectId(property_id) });
        console.log(property_images.length)
        res.status(200).send(jsonResponse(property_images, 200));
    } catch (e) {
        console.log('Error occurred during fetching images : ', e);
        res.status(500).send(Internal_Server_Error)
    }
}

const postPropertyImages = async (req, res) => {
    try {
        let property_id = req.params.id;
        console.log('Adding images for Property : ' + property_id);
        let imagesList = req.body;
        let imageObject = getPropertyImagesObject(imagesList, property_id)
        await propertyImagesModel.insertMany(imageObject, (err, docs) => {
            if (err) {
                console.log('Error occurred during adding images : ', e);
                res.status(500).send(Internal_Server_Error)
            } else {
                console.log('Successfully inserted images');
                res.status(200).send(jsonResponse('Successfully inserted images', 200))
            }

        })
    } catch (e) {
        console.log('Error occurred during fetching images : ', e);
        res.status(500).send(Internal_Server_Error)
    }
}

function getPropertyImagesObject(imagesList, _id) {

    imagesList?.forEach(e => { e.property_id = _id });
    // console.log(imagesList)
    return imagesList;
}

const getPropertiesByHost = async (req, res) => {

    try {
        let host_id = req.user_id
        let propertiesList = await propertyModel.find({ host_id: host_id })
            .select({ name: 1, is_active: 1, created_at: 1 })

        return res.send(jsonResponse(propertiesList, 200)).status(200);
    } catch (e) {
        console.log('Exception occurred during fetch of properties by host :', e)
        res.status(500).send(Internal_Server_Error)
    }
}
module.exports = { getPropertyBasedOnQuery, listAProperty, deleteProperty, searchQuery: searchProperty, getPropertyImages, postPropertyImages, findPropertyById, getPropertiesByHost };
