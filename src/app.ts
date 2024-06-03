import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import limiter from './config/rate-limit';
import requestLogger from './middleware/request-logger';
import homeRoute from './routes/home-route';
import errorHandler from './middleware/error-handler';
import notFoundHandler from './middleware/not-found-handler';

const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(limiter);
app.use(requestLogger);
app.use(express.json());

app.use('/', homeRoute);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.info(`app is listening port: ${port}`);
});