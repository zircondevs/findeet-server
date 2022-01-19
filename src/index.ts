import express, { Express } from 'express';
import { config as envConfig } from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/index';

envConfig();

const app: Express = express(),
	port: number = Number(process.env.PORT) || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
routes(app);

(async function preServerStartUp() {
	await mongoose.connect(
		`${process.env.MONGODB_URL}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`
	);
})()
	.then(() => {
		app.listen(port, () => {
			console.log(`Server Running on PORT: ${port}.`);
		});
	})
	.catch(err => {
		throw err;
	});
