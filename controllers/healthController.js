
const healthCheck=(req, res, next) => {
    console.log("Health OK");
    res.status(200).send("OK");
}

module.exports={healthCheck}
