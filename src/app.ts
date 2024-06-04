import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import limiter from './config/rate-limit';
import requestLogger from './middleware/request-logger';
import homeRoute from './routes/home-route';
import errorHandler from './middleware/error-handler';
import notFoundHandler from './middleware/not-found-handler';
import mongoose from 'mongoose';
import logger from './config/logger';
import authRoute from './routes/auth-route';

const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);
const mongoUri: string = process.env.MONGO_URI || '';

app.use(limiter);
app.use(requestLogger);
app.use(express.json());

app.use('/', homeRoute);
app.use('/auth', authRoute);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    try {
        logger.info('Connecting to database...');
        await mongoose.connect(mongoUri);
        logger.info('Connected to database');
        app.listen(port, () => {
            logger.info(`App is running on port: ${port}`);
        }); 
    } catch (error) {
        logger.error('Error connecting with db ', error);
        process.exit(1);
    }
}

startServer();
