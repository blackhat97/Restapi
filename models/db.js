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
        const existQuery = await db.query(`SELECT * FROM main.Comic;`);
        if (existQuery.length == 0) {
            console.log('No data detected. Creating now.');
            const sql = await getFile('./db_scheme/db_initial_setting.sql', 'utf8');
            await db.query(sql);
            return true;
        }
        return false;
        
    } catch (e) {
        console.error('Could not connect to Mysql database. Please be sure the server is running.');
        throw e;
    }
}

module.exports = {
    db,
    startDB
};

