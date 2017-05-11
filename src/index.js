import path from 'path';
import mongoose from 'mongoose';
import winston from 'winston';
import Migration from './models/migration';
import {filter, includes} from 'lodash';

const filterAvailableMigrations = (availableMigrations, previousMigrations) => filter(availableMigrations, migration => !includes(previousMigrations, migration));

const getAvailableMigrations = () => new Promise((resolve, reject) => {
	const migrationsFolder = './migrations/';
	const fs = require('fs');
	fs.readdir(migrationsFolder, (err, files) => {
		const migrations = files.map(migration => migration.replace('.js', ''))
		if (err) {
			reject(err);
			return;
		}
		resolve(migrations);
	});
});

const migrateToLatest = (migrationsToRun) => {
	return Promise.all(migrationsToRun.map(migrationName => {
  		winston.log('info', `Running ${migrationName}.`);
		const migration = require(path.join(__dirname, 'migrations', migrationName));
		return migration.up();
  	})).then(() => {
		winston.log('info', 'Updating migrations collection.');
		// TODO: Update the migrations collection
  	});
};

const getPreviousMigrations = () => new Promise((resolve, reject) => {
	Migration.find(function (err, results) {
		if (err) {
			winston.log(err);
			reject(err);
			mongoose.connection.close();
			return;
		}
		resolve(results);
		mongoose.connection.close();
	});
});

const removeLastMigrationFromMongo = (lastMigration) => new Promise((resolve, reject) => {
	Migration.remove({ _id: lastMigration }, function(err) {
	    if (err) {
	            reject(err);
	            return;
	    }
	    resolve();
	});
});

winston.log('info', 'starting migration service.');
const connection = mongoose.connect(process.env.GM_DB, { server: { socketOptions: { keepAlive: 1 } } });

const doUp = () => {
	winston.log('info', 'Migrating to latest.');

	getPreviousMigrations().then(results => {
		const previousMigrations = results.map(result => result.id).sort();

		return getAvailableMigrations().then(availableMigrations => {
		  	const migrationsToRun = filterAvailableMigrations(availableMigrations, previousMigrations);

			if (migrationsToRun.length == 0) {
				winston.log('info', 'No migrations to run.');
				return;
			}

			winston.log('info', 'Running the following migrations:');
			winston.log('info', migrationsToRun);

			return migrateToLatest(migrationsToRun);
		});
	}).then(() => {
		winston.log('info', 'Done.');
	}).catch((err) => {
		throw new Error(err);
	});
};

const doDown = () => {
	winston.log('info', 'Rolling back one migration.');

	getPreviousMigrations().then(results => {
		const previousMigrations = results.map(result => result.id).sort();
		const lastMigration = previousMigrations[previousMigrations.length - 1];
		const migration = require(path.join(__dirname, 'migrations', lastMigration));
		migration.down().then(() => {
			return removeLastMigrationFromMongo();
		}).catch((err) => {
			throw new Error(err);
		})
	});
}

export default function () {
	if (process.env.GM_MIGRATION_DIRECTION === 'down') {
		doDown();
	} else if (process.env.GM_MIGRATION_DIRECTION === 'up') {
		doUp();
	} else {
		throw new Error('No migration direction available.');
	}
}

