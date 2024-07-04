const express = require('express');

// This is a router that will be used to define the routes for the application
const router = express.Router();

// Define the routes
router.use('/auth', require('./auth'));

router.use('/current', require('./current'));

router.use('/consumption', require('./consumption'));

module.exports = router;
