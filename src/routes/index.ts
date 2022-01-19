import { Express } from 'express';
import authRouting from './auth';

export default (app: Express) => {
	app.use('/v1/auth', authRouting());
};
