const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware/auth");

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.json({ message: "Welcome to the dashboard" });
});

module.exports = router;
