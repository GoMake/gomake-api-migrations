module.exports.id = '20170326092900-userIds';

module.exports.up = () => new Promise((resolve, reject) => {
  var coll = this.db.collection('flights');
  coll.update(
  	{ userIds: { $exists: false } }, 
  	{ $set: { userIds: [] } }, 
  	{ multi: true }, 
  	resolve
  );
});

module.exports.down = () => new Promise((resolve, reject) => {
  var coll = this.db.collection('flights');
  coll.update(
  	{}, 
  	{ $unset: { userIds: [] } }, 
  	{ multi: true }, 
  	resolve
  );
console.log("-------------------");
});
