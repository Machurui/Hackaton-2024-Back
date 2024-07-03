const express = require("express");
const randomValue = require("../lib/random");
const ensureAuthenticated = require("../middleware/auth");

const router = express.Router();

router.get("/currentPower", ensureAuthenticated, (req, res, next) => {
  currentPower = randomValue(200, 9000);
  res.json({ currentPower });
});

router.get("/currentProduction", ensureAuthenticated, (req, res, next) => {
  currentProd = randomValue(6000, 6900);
  res.json({ currentProd });
});

module.exports = router;
