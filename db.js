const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

async function getConnection() {
  return await sql.connect(dbConfig);
}

module.exports = { sql, getConnection };
    