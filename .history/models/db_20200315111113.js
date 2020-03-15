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

const getFile = (fileName, type) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, type, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

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

const startDB = async () => {
    try {
        const existQuery = await db.query(`SELECT EXISTS (
            SELECT 1
            FROM   information_schema.tables 
            WHERE  table_schema = 'main'
          );`);
    } catch (e) {
        console.error('Could not connect to postgres database. Please be sure the server is running.');
        console.error('You may also need to set the SQL_USER, SQL_DATABASE and SQL_PASSWORD variables in config/config.json.');
        console.error('For more details read https://node-postgres.com/features/connecting');
        throw e;
    }
}

module.exports = db;

