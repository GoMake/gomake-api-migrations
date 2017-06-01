import Migration from '../models/migration';
import down from './down';
import up from './up';

const migrators = ({connection}) => {
	const getPreviousMigrations = () => Migration.find().exec()
				.then(results => results.map(result => result.id).sort())
				.catch((err) => { throw new Error(err) });

	const dependencies = {
		getPreviousMigrations: getPreviousMigrations,
		Migration: Migration,
		connection: connection
	};

	return {
		down: down(dependencies),
		up: up(dependencies)
	};
}

export default migrators;