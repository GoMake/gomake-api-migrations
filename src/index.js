import mongoose from 'mongoose';
import winston from 'winston';
import _preconditions from 'preconditions';

import constants from './constants';
import handlers from './handlers';
import _migrators from './migrators';

const preconditions = _preconditions.errr();

mongoose.Promise = global.Promise;

const isValidMigrationDirection = migrationDirection => (migrationDirection === constants.MIGRATION_DIRECTIONS.down) || (migrationDirection === constants.MIGRATION_DIRECTIONS.up);

export default function () {
	const migrationDirection = process.env.GM_MIGRATION_DIRECTION;
	const databaseUrl = process.env.GM_DB;

	preconditions.shouldBeDefined(migrationDirection, constants.ERROR_MESSAGES.missingDirection).test();
	preconditions.shouldBeDefined(databaseUrl, constants.ERROR_MESSAGES.missingDatabase).test();
	if (!isValidMigrationDirection(migrationDirection)) {
		throw new Error(constants.ERROR_MESSAGES.invalidDirection);
	}

	winston.log('info', 'starting migration service.');
	const connection = mongoose.connect(databaseUrl, constants.MONGOOSE);

	const dependencies = {
		connection: mongoose.connection
	};

	const migrators = _migrators(dependencies);

	migrators[migrationDirection]()
			.then(handlers.success)
			.catch(handlers.error);
}

