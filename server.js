const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");

const app = express();
const mainRouter = require("./routes/index");

// .env config
dotenv.config();
// Passport config
require("./config/passport")(passport);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


// Express session middleware
app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000, // Session timeout of 10 minutes = 600000
      secure: false, // Set to true if using HTTPS
      sameSite: 'none', // Strict or Lax
      httpOnly: true,
      partitioned: true,
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Add the middleware to the app
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://127.0.0.1:3000',
    'https://localhost:3000/'
  ],
  credentials: true,
  optionSuccessStatus: 200,
  exposedHeaders: ['set-cookie'],
}));


app.get("/", (req, res) => {
  res.send("Smart Grid App API");
});

// Use the main router
app.use("/api", mainRouter);

app.use(async function (req, res) {
  return res.status(404).json({ status: 404, error: 'Not found' });
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
