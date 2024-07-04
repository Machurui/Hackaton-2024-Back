const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const ensureAuthenticated = require("../middleware/auth");

const router = express.Router();

/**
     * POST /auth/register
     * Create a new user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, profilePicture } = req.body;

  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      profilePicture,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

/**
     * POST /auth/login
     * Authenticate a user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      console.log("At creation", req.isAuthenticated());
      return res.json({ message: "Logged in successfully" });
    });
  })(req, res, next);
});

/**
     * POST /auth/logout
     * Log out a user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
router.post("/logout", ensureAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logged out successfully" });
  });
});

/**
     * GET /auth/check
     * Check if a user is authenticated.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
router.get("/check", function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.json({ message: "User is authenticated" });
  }
  return res.status(401).json({ message: "User is not authenticated" });
});

module.exports = router;
