const express = require('express'); //import express


const router  = express.Router(); 

const healthController = require('../controllers/healthController'); 

router.get('/health', healthController.healthCheck); 

module.exports = router; // export to use in server.js