'use strict';
require('dotenv').config();

let json = {};
try {
  json = require('./config/config.json');
} catch (e) {
  json = {};
}

const config = {
  db: {
    host: json.SQL_HOST || process.env.SQL_HOST,
    user: json.SQL_USER || process.env.SQL_USER,
    name: json.SQL_DATABASE || process.env.SQL_DATABASE,
    pass: json.SQL_PASSWORD || process.env.SQL_PASSWORD,
  },
  cloudBucket: json.CLOUD_BUCKET || process.env.CLOUD_BUCKET,
  jwtSecret: json.JWT_SECRET || process.env.JWT_SECRET || 'TestSecret',
  sendgridAPIKey: json.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY
};

module.exports = config;