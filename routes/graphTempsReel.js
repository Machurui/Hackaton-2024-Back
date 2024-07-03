const express = require("express");
const { randomValue } = require("../lib/random");
const ensureAuthenticated = require("../middleware/auth");

const router = express.Router();

router.get("/currentConsum", ensureAuthenticated, () => {
    randomValue(200,9000);
    return randomValue;
});



router.get("/currentProd", ensureAuthenticated, () => {
    randomValue(6000,6900);
    return randomValue;
});

module.exports=router