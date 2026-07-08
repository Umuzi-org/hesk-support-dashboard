const mysql = require("mysql2/promise");
const { execSync } = require("child_process");
const fs = require("fs");

async function importDump(sqlFilePath) {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    multipleStatements: true,
  });

  const sql = fs.readFileSync(sqlFilePath, "utf8");

  const setupQuery = `create Database if not exists umuzi;
  USE umuzi`;
  await conn.query(setupQuery);
  await conn.query(sql);

  await conn.end();
}

async function query(sql) {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
  });

  const [rows] = await conn.query(sql);
  await conn.end();

  return rows;
}

module.exports = { importDump, query };
