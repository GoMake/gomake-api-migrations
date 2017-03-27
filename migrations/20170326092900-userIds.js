exports.id = '20170326092900-userIds';

exports.up = function (done) {
  var coll = this.db.collection('flights');
  coll.update({ userIds: { $exists: false } }, { $set: { userIds: [] } }, { multi: true }, done);
};

exports.down = function (done) {
  var coll = this.db.collection('flights');
  coll.update({}, { $unset: { userIds: [] } }, { multi: true }, done);
};
