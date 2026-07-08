require("dotenv").config();
const mysql = require("mysql2/promise");

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER_ROOT,
    password: process.env.MYSQL_PASSWORD_ROOT,
  });

  console.log("Connected as root");

  await conn.query(`
    CREATE USER IF NOT EXISTS 'hesk_user'@'localhost'
    IDENTIFIED BY 'StrongPassword123!';
  `);

  await conn.query(`
    CREATE DATABASE IF NOT EXISTS umuzi;
  `);

  await conn.query(`
    GRANT ALL PRIVILEGES ON umuzi.* TO 'hesk_user'@'localhost';
  `);

  await conn.query(`FLUSH PRIVILEGES;`);

  console.log("User created + permissions granted");

  await conn.end();
})();
