import mongoose from 'mongoose';
import winston from 'winston';

const handlers = {
	success: () => {
		mongoose.connection.close();
	},
	errorHandler: err => {
		throw new Error(err);
	}
};

export default handlers;