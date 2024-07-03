const express = require("express");
const randomValue = require("../lib/random");
const ensureAuthenticated = require("../middleware/auth");

const router = express.Router();

router.get("/currentPower", ensureAuthenticated, (req, res, next) => {
  const currentPower = randomValue(200, 9000);
  res.json({ currentPower });
});

router.get("/currentProduction", ensureAuthenticated, (req, res, next) => {
  const currentProduction = randomValue(6000, 6900);
  const productionPercentage = (currentProduction / 7500) * 100;
  res.json({ currentProduction, productionPercentage });
});

module.exports = router;
