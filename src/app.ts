import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import requestLogger from './middleware/request-logger';
import { homeRoute } from './routes/home-route';

const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(requestLogger);
app.use(express.json());

app.use('/', homeRoute);

app.listen(port, () => {
    console.info(`app is listening port: ${port}`);
});