var reviewsModel = require('../model/reviews');

const create = (req, res, next) => {
    console.log("Inside Add a review API");
    let body = req.body;
    console.log(body)
    var newReview = new reviewsModel(body);
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
}

// get the list of reviews written sorted by date desc order
// with pagination support
const getReview = async (req, res) => {
    console.log("Inside get Review model for property_id");
    try{
        const {property_id, host_id, page_no, page_size} = req.query;

        // default values have to provided for pagination 
        // else docs will be empty array
        const page_options = {
            page: page_no || 1,
            limit: page_size || 10,
            sort: {
                created_at : -1
            }
        }
        let query;

        if ( property_id !== null && typeof property_id !== "undefined") {
            console.log("Query for property : " + property_id);
            query = { "property_id": property_id };
        }else{
            console.log("Query for host : " + host_id);
            query = { "host_id": host_id };
        }
        console.log("Final Query : " + JSON.stringify(query));
        let result = await reviewsModel.paginate(
            query
            //, page_options
        );
        console.log("Total Elements found : " + result.docs.length);
        res.status(200).send(result);
    }catch(e){
        console.error("Error occurred : " + e);
        res.status(500).send("Internal Server Error.");
    }
}

module.exports={create, getReview};
