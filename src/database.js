const mysql = require('mysql');
const { promisify }= require('util');



const pool = mysql.createPool({
host: 'localhost',
user: 'tallerdellago',
password: 'Dellago2024.',
database: 'taller_dellago',
        clearExpired: true,
        checkExpirationInterval: 30000,
        expiration: 1000
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  }

  if (connection) connection.release();
  console.log('DB is Connected');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;
