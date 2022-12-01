const jwt = require('jsonwebtoken');

const expiry = '30h';
const access_token_secret = 'D7F38637-4F25-4309-853B-EFDEC17B8BA1'

const jsonResponse = (response, status) => {
    return JSON.stringify({ status: status, message: response });
}

const Internal_Server_Error = jsonResponse("Internal Server Error.", 500);


/* Function that generates the JWT token
Embeds user_id and is_host details into
the token, which can be used later */
function generateToken(userDetails) {

    console.log("Generating JWT for user : " + userDetails._id);

    try {
        return jwt.sign(
            { user_id: userDetails._id, is_host: userDetails.is_host },
            access_token_secret,
            { expiresIn: expiry }
        );
    } catch (e) {
        console.log("Error occurred in generating Token : " + e)
        return null;
    }
}

/* Middleware layer that can be added 
to all Routes which will authenticate
based on the validity of the user
and check if valid, will let the user 
into the controller, also adds the 
user_id and is_host parameter into the 
request, which can be captured and used */
function authenticateToken(req, res, next) {
    console.log("Validating Token")
    try {
        const header = req.headers['authorization'];
        console.log(header)
        const token = header && header.split(' ')[1]

        // console.log(1)
        if (token === "undefined" || typeof (token) === "undefined") {
            console.log("Missing Token")
            return res.status(401).send(jsonResponse("Missing Token", 401));
        }

        console.log(2)
        console.log(token)

        jwt.verify(token, access_token_secret, (err, { user_id, is_host }) => {
            console.log(3)
            if (err) {
                console.log(4)
                console.error("Error occurred during validation : " + err);
                res.status(401).send(jsonResponse("Invalid Token", 401))
            }
            console.log(5)
            console.log("Valid Token")
            req.user_id = user_id;
            req.is_host = is_host;
            next();
        })
    } catch (ex) {
        console.error("Exception occurred during token validation " + ex);
        res.status(500).send(jsonResponse("Invalid token", 401))
    }
}
module.exports = { generateToken, authenticateToken };