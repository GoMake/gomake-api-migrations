const constants = {
	MONGOOSE: { server: { socketOptions: { keepAlive: 1 } } },
	ERROR_MESSAGES: {
		missingDirection: 'Missing a migration direction.',
		missingDatabase: 'Missing a database URL.',
		invalidDirection: 'A migration direction must either be "up" or "down".'
	},
	MIGRATION_DIRECTIONS: {
		down: 'down',
		up: 'up'
	},
	BASE_PATH: __dirname
};

export default constants;