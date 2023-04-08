const pgPromise = require('pg-promise')();

const config = {
  host: 'localhost',
  port: 5432,
  database: 'reviews',
  user: 'mevcaus',
  password: 'LakeCascade13',
};

const db = pgPromise(config);

module.exports = db;
