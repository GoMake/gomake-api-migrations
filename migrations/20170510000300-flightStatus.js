module.exports.id = '20170510000300-flightStatus';

module.exports.up = () => new Promise((resolve, reject) => {
	console.log('up!');
	resolve();
});

module.exports.down = () => new Promise((resolve, reject) => {
	console.log('down!');
	resolve();
});