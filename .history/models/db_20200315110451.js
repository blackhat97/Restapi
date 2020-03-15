'use strict';

const mysql = require('mysql2');
const util = require('util');
const config = require('../config');
const fs = require('fs');


const db = mysql.createPool({
  connectionLimit : 10,
  supportBigNumbers: true,
  bigNumberStrings: true,
  host     : config.host,
  user     : config.db_user,
  password : config.db_pass,
  database : config.db_name,
  charset : "utf8_general_ci",
  multipleStatements: true
});
db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

db.query = util.promisify(db.query);




module.exports = db;

