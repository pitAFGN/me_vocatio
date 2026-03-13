const { Pool } = require("pg");

const pool = new Pool({
  user: "mevocatio",
  host: "localhost",
  database: "mevocatio",
  password: "123456",
  port: 5432
});

module.exports = pool;