import express, { Express } from 'express';
import { config as envConfig } from 'dotenv';

envConfig();
let name: string;
const app: Express = express(),
	port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
	console.log(`Server Running on PORT: ${port} ${name}.`);
});
