const express = require("express");
const ensureAuthenticated = require("../middleware/auth");

const router = express.Router();

/**
 * GET /user/datas
 * Get the user datas.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get("/datas", ensureAuthenticated, (req, res, next) => {
  const user = req.user;

  res.json(user);
});

module.exports = router;
