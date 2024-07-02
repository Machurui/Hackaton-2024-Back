const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");

dotenv.config();

const app = express();
app.use(express.json());

// Passport config
require("./config/passport")(passport);

// Express session middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Smart Grid App API");
});

// Use the main router
const mainRouter = require("./routes/index");
app.use("/api", mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
