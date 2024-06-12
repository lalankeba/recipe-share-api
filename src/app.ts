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
import configurePassport from './config/passport-config';
import passport from 'passport';
import userRoute from './routes/user-route';
import cors from 'cors';

const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);
const mongoUri: string = process.env.MONGO_URI || '';

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    credentials: true
}

configurePassport(passport);

app.use(cors(corsOptions));
app.use(limiter);
app.use(requestLogger);
app.use(express.json());
app.use(passport.initialize());

app.use('/', homeRoute);
app.use('/auth', authRoute);
app.use('/users', userRoute);

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
