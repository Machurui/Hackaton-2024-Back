const express = require("express");
const client = require("../config/clickhouse");
const ensureAuthenticated = require("../middleware/auth");

const router = express.Router();

router.get(
  "/userConsumptionAndForecasts/:userID",
  ensureAuthenticated,
  async (req, res) => {
    const userID = req.params.userID;

    try {
      const query = `
      SELECT timestamp, Predictions, Actuals 
      FROM hackaton2024.predict 
      WHERE userID = '${userID}'
    `;

      // Check if query is a string and not undefined
      if (typeof query !== "string") {
        throw new Error("Query is not a string");
      }

      // Execute the query and get the result
      const row = await client.query({ query });
      const resultSet = await row.json();

      const data = resultSet.data.map((row) => ({
        timestamp: row.timestamp,
        Predictions: row.Predictions,
        Actuals: row.Actuals,
      }));

      res.json({ data });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({
        message: "Error fetching data from ClickHouse",
        error: error.message || error,
      });
    }
  }
);

module.exports = router;
