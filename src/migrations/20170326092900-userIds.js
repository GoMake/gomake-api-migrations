const winston = require('winston');

module.exports.id = '20170326092900-userIds';

module.exports.up = (db) => new Promise((resolve, reject) => {
  winston.log('info', 'running up in 20170326092900-userIds');
  var coll = db.collection('flights');
  coll.update(
  	{ userIds: { $exists: false } }, 
  	{ $set: { userIds: [] } }, 
  	{ multi: true }, 
  	resolve
  );
});

module.exports.down = (db) => new Promise((resolve, reject) => {
  winston.log('info', 'running down in 20170326092900-userIds');
  var coll = db.collection('flights');
  coll.update(
  	{}, 
  	{ $unset: { userIds: [] } }, 
  	{ multi: true }, 
  	resolve
  );
});
