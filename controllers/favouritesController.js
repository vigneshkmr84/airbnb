const bson = require('bson');
var propertyModel = require('../model/property');
var favouritesModel = require('../model/favourites');

const jsonResponse = (response, status) => {
    return { status: status, message: response };
}

const Internal_Server_Error = jsonResponse("Internal Server Error.", 500);


// will read the property id's and then query them to the 
// property collection to fetch the complete details
// if property is null, it will not be returned
// Need to work on return on reverse date added
const getFavouritesByUserId = async (req, res) => {
    let user_id = req.params.id;
    console.log("Get list of Favourite properties for user : " + user_id);
    let query = { user_id: user_id };
    var userData;
    try {
        userData = await favouritesModel.findOne(query)
            .clone()
        // .select({ favourites: 1, _id: 0 });

        let favourites_list = userData.favourites;
        // console.log(favourites_list)
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
        // console.log(object_id_list);

        var newQuery = { _id: { $in: object_id_list } }
        // console.log(newQuery);
        property_list = await propertyModel.find(newQuery);

        console.log('Total elements found: ', property_list.length)

        res.status(200).send(jsonResponse(property_list, 200));
    } catch (e) {
        console.log("Error occurred during query " + e);
        res.status(500).send(Internal_Server_Error);
    }
}


const insertFirstRecord = async (user_id, p_id) => {
    let newFavourites = new favouritesModel({ user_id: user_id, favourites: [p_id] })
    await newFavourites.save((err, doc) => {
        if (!err) {
            id = doc._id;
            console.log("New Inserted ID : " + id);
        } else {
            console.error("Error occurred in creating user : " + err);
        }
    })
}

// add property to favourites list
const addToFavourites = async (req, res) => {
    let user_id = req.params.id;
    let property_id = req.body.id;
    console.log("Adding property id : " + property_id + " to favourites for user : " + user_id);
    let query = { user_id: user_id };
    let updates = { $push: { favourites: property_id } };

    // need to find one, if it doesn't exist insert a new record totally
    try {
        await favouritesModel.findOneAndUpdate(query, updates, function (err, docs) {
            if (docs === null) {
                insertFirstRecord(user_id, property_id);
            }
        }).clone();

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
        await favouritesModel.updateOne(
            { user_id: user_id },
            { $pullAll: { favourites: [property_id] } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Successfully removed");
                }
            }).clone();

        console.log("Removed Successfully");
        res.status(200).send(jsonResponse("Removed Successfully", 200));
    } catch (e) {
        console.error("Error occurred while removing favourites " + e)
        res.status(500).send(Internal_Server_Error);
    }
};

module.exports = { removeFromFavourites, addToFavourites, getFavouritesByUserId };
