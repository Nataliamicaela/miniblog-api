const pool = require('../db/config');

afterAll(async () => {

  await pool.end();

});