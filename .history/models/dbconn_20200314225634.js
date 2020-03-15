'use strict';

var mysql = require('mysql2');
const util = require('util');
var Config = require('../config');


const db = mysql.createPool({
  connectionLimit : 10,
  supportBigNumbers: true,
  bigNumberStrings: true,
  host     : Config.host,
  user     : Config.db_user,
  password : Config.db_pass,
  database : Config.db_name,
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

