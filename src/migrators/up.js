import path from 'path';

import winston from 'winston';

import {filterByExtension, getFileNames, removeExtensions} from '../util/files';
import {setDifference} from '../util/sets';
import sequentialApply from '../util/sequential-apply';
import constants from '../constants';

const up = ({getPreviousMigrations, Migration, connection}) => () => {	
	const getAvailableMigrations = () => getFileNames(path.join(constants.BASE_PATH, 'migrations'))
			.then(filterByExtension('.js'))
			.then(removeExtensions('.js'));

	const migrateToLatest = (migrationsToRun) => {
		const migrationPromises = migrationsToRun.map(generateMigrationRunner);
		return sequentialApply(migrationPromises).catch(err => { throw new Error(err) });
	};

	const generateMigrationRunner = migrationName => () => {
		const migration = require(path.join(constants.BASE_PATH, 'migrations', migrationName));
		winston.log('info', `Running ${migrationName}.`);

		return migration.up(connection).then(() => {
			winston.log('info', `Updating migrations collection to reflect: ${migrationName}.`);
			return addMigrationToMigrationsTable(migration);
	  	}).catch(err => {
	  		throw new Error(err);
	  	});
	};

	const addMigrationToMigrationsTable = migration => {
		const completedMigration = new Migration({id: migration.id});
		return completedMigration.save();
	};
	
	winston.log('info', 'Migrating to latest.');

	return getPreviousMigrations()
		.then(previousMigrations => {
			return getAvailableMigrations()
				.then(availableMigrations => setDifference(availableMigrations, previousMigrations))
				.then(migrationsToRun => migrationsToRun.sort());
		}).then(migrationsToRun => {
			if (migrationsToRun.length == 0) {
				winston.log('info', 'No migrations to run.');
			} else {
				winston.log('info', 'Running the following migrations:');
				winston.log('info', migrationsToRun);
				return migrateToLatest(migrationsToRun).then(() => {winston.log('info', 'Done.')}).catch(err => { throw new Error(err) });
				
			}
		}).catch(err => { throw new Error(err); });
};

export default up;