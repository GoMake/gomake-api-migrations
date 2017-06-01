const winston = require('winston');

module.exports.id = '20170510000300-flightStatus';

module.exports.up = (db) => new Promise((resolve, reject) => {
	winston.log('info', 'running up in 20170510000300-flightStatus');
	resolve();
});

module.exports.down = (db) => new Promise((resolve, reject) => {
	winston.log('info', 'running down in 20170510000300-flightStatus');
	resolve();
});