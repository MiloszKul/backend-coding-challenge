'use strict';

require('dotenv/config');

var _require = require('winston'),
    createLogger = _require.createLogger,
    format = _require.format,
    transports = _require.transports;

var combine = format.combine,
    timestamp = format.timestamp,
    prettyPrint = format.prettyPrint;

var fs = require('fs');

//logger instance for the service using winston
var date = new Date();

//create logs folder if it doesnt exist
if (!fs.existsSync(process.env.LOGS_DIRECTORY)) {
  fs.mkdirSync(process.env.LOGS_DIRECTORY);
}

//exports and instance of the logger 
module.exports = createLogger({
  level: 'info',
  format: combine(timestamp(), prettyPrint()),
  transports: [new transports.File({ filename: process.env.LOGS_DIRECTORY + '/error_' + date.toISOString() + '.log', level: 'error', handleExceptions: true }), new transports.File({ filename: process.env.LOGS_DIRECTORY + '/combined_' + date.toISOString() + '.log', handleExceptions: true })]
});

console.log('log started for session see ' + process.env.LOGS_DIRECTORY + '/combined_' + date.toISOString() + '.log');