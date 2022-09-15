const jwt = require('jsonwebtoken');

const expiry = "10h";

// const generateToken = (userDetails) => {
function generateToken(userDetails) {

    console.log("Generating JWT for user : " + userDetails._id);

    try {
        return jwt.sign(
            { userId: userDetails._id, is_host: userDetails.is_host },
            "Pas$worD",
            { expiresIn: expiry }
        );
    } catch (e) {
        console.log("Error occurred in generating Token : " + e)
        return null;
    }
}

module.exports = { generateToken };