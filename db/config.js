const { loadEnvFile } = require('node:process');
const { Pool } = require('pg');

loadEnvFile('.env');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

module.exports = pool;