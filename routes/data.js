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
        ORDER BY timestamp
      `;

      // Log the query to debug
      console.log("Executing query:", query);

      // Check if query is a string and not undefined
      if (typeof query !== "string") {
        throw new Error("Query is not a string");
      }

      // Execute the query and get the result
      const row = await client.query({ query });
      const resultSet = await row.json();

      console.log("Query result:", resultSet);

      // Calculate consumption
      let totalConsumption = 0;
      let previousRow = null;

      const data = resultSet.data.map((row) => {
        if (previousRow) {
          const timeDifference =
            (new Date(row.timestamp) - new Date(previousRow.timestamp)) /
            3600000;
          const consumption = row.Actuals * timeDifference;
          totalConsumption += consumption;
        }
        previousRow = row;
        return {
          timestamp: row.timestamp,
          Predictions: row.Predictions,
          Actuals: row.Actuals,
        };
      });

      res.json({ data, totalConsumption });
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
