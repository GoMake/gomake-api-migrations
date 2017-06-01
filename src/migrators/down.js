import path from 'path';
import winston from 'winston';
import constants from '../constants';

const down = ({getPreviousMigrations, Migration, connection}) => () => {
	const removeMigrationFromMongo = (lastMigration) => Migration.remove({ id: lastMigration }).exec()
	.catch(err => { throw new Error(err); });

	winston.log('info', 'Rolling back one migration.');

	return getPreviousMigrations()
			.then(previousMigrations => previousMigrations[previousMigrations.length - 1])
			.then(lastMigration => {
				const migration = require(path.join(constants.BASE_PATH, 'migrations', lastMigration));
				return migration.down(connection)
						.then(() => removeMigrationFromMongo(lastMigration))
						.catch(err => { throw new Error(err); });
			})
			.catch((err) => { throw new Error(err); });
};

export default down;