const express = require("express");
const randomValue = require("../lib/random");
const ensureAuthenticated = require("../middleware/auth");

const router = express.Router();

/**
     * GET /current/power
     * Get the current power randomized.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
router.get("/power", ensureAuthenticated, (req, res, next) => {
  try {
    const currentPower = randomValue(200, 9000);
    res.json({ currentPower });
  } catch (error) {
    res.status(500).json({ message: "Error getting power", error });
  }
});

/**
     * GET /current/production
     * Get the current production and the percentage randomized.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
router.get("/production", ensureAuthenticated, (req, res, next) => {
  try {
    const currentProduction = randomValue(6000, 6900);
    const productionPercentage = (currentProduction / 7500) * 100;
    res.json({ currentProduction, productionPercentage });
  } catch (error) {
    res.status(500).json({ message: "Error getting production", error });
  }
});

module.exports = router;
