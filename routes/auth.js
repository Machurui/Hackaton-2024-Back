const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

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
      return res.json({ message: "Logged in successfully", user });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
