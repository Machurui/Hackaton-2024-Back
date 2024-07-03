const { createClient } = require("@clickhouse/client");
const dotenv = require("dotenv");

dotenv.config();

const client = createClient({
  url: process.env.CLICKHOUSE_URI,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  format: "json",
});

module.exports = client;
