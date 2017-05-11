const mongoose = require('mongoose');

const MigrationSchema = new mongoose.Schema(
	{ id: String },
	{ collection: 'migrations' }
);

module.exports = mongoose.model('Migration', MigrationSchema);
