const express = require("express");
const randomValue = require("../lib/random");
const ensureAuthenticated = require("../middleware/auth");

const router = express.Router();

router.get("/currentConsum", ensureAuthenticated, (req, res, next) => {
  currentConsum = randomValue(200, 9000);
  res.json({ currentConsum });
});

router.get("/currentProd", ensureAuthenticated, (req, res, next) => {
  currentProd = randomValue(6000, 6900);
  res.json({ currentProd });
});

module.exports = router;
