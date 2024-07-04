const express = require("express");
const client = require("../config/clickhouse");
const ensureAuthenticated = require("../middleware/auth");
const moment = require("moment");

const router = express.Router();

/**
 * GET /consumption/consumptionAndForecasts/
 * Get the consumption forecasts for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get(
  "/consumptionAndForecasts",
  ensureAuthenticated,
  async (req, res) => {
    const userID = req.user._id;

    const simulatedDate = "2024-06-07 15:30:00";
    var query = "";

    try {
      if (simulatedDate) {
        query = `
          SELECT
            timestamp,
            Predictions,
            Actuals
          FROM hackaton2024.predict
          WHERE userID = '${userID}' 
          AND timestamp >= subtractHours(toDateTime('${simulatedDate}'), 6)
          AND timestamp <= toDateTime('${simulatedDate}')
          ORDER BY timestamp
        `;
      } else {
        query = `
          SELECT
            timestamp,
            Predictions,
            Actuals
          FROM hackaton2024.predict
          WHERE userID = '${userID}'
          AND timestamp >= now() - interval 6 hour
          GROUP BY timestamp
          ORDER BY timestamp
        `;
      }
    } catch (error) {
      console.error("Error generating query:", error);
    }

    try {
      // Check if query is a string and not undefined
      if (typeof query !== "string") {
        throw new Error("Query is not a string");
      }

      // Execute the query and get the result
      const row = await client.query({ query });
      const resultSet = await row.json();

      // Calculate consumption
      let totalConsumption = 0;
      const simulatedDate = "2024-06-07 15:30:00";
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
          timestamp: moment(row.timestamp).format("HH:mm"),
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

/**
 * GET /consumption/last24/:userID
 * Get the consumption for the last 24 hours.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get("/last24", ensureAuthenticated, async (req, res) => {
  const userID = req.user._id;

  const simulatedDate = "2023-03-09 16:30:00";
  var query = "";

  try {
    if (simulatedDate) {
      query = `
        SELECT
          toStartOfHour(date) AS hour,
          SUM(Wh) AS totalWh
        FROM hackaton2024.edf
        WHERE userID = '${userID}' AND date >= subtractDays(toDateTime('${simulatedDate}'), 1)
        AND date <= toDateTime('${simulatedDate}')
        GROUP BY hour
        ORDER BY hour
      `;
    } else {
      query = `
        SELECT
          toStartOfHour(date) AS hour,
          SUM(Wh) AS totalWh
        FROM hackaton2024.edf
        WHERE userID = '${userID}' AND date >= now() - interval 1 day
        GROUP BY hour
        ORDER BY hour
      `;
    }
  } catch (error) {
    console.error("Error generating query:", error);
  }

  try {
    // Check if query is a string and not undefined
    if (typeof query !== "string") {
      throw new Error("Query is not a string");
    }

    // Execute the query and get the result
    const row = await client.query({ query });
    const resultSet = await row.json();

    // Transform the result to match the expected format
    const data = resultSet.data.map((row) => ({
      hour: moment(row.hour).format("HH"),
      totalWh: row.totalWh,
    }));

    res.json({ data });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({
      message: "Error fetching data from ClickHouse",
      error: error.message || error,
    });
  }
});

module.exports = router;
