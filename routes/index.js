const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const protectedRoutes = require("./protected");
const graphCurrentConsum = require("./graphTempsReel")
const graphCurrentProd = require("./graphTempsReel");

router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);
router.use("/graphCurrent",graphCurrentConsum);
router.use("/graphProd",graphCurrentProd);


module.exports = router;
