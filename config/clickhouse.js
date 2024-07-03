const { ClickHouseClient, createClient } = require("@clickhouse/client");

const client = createClient({
  url: "http://web.exedesk.fr:8123",
  username: "root",
  password: "H8QRqtQseeoMYFgE",
  format: "json",
});

module.exports = client;
