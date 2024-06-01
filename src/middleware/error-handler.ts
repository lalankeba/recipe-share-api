import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error occurred');
    logger.error(err.stack);

    const statusCode = err.statusCode || 500;

    const response = {
        message: err.message || 'Internal Server Error',
    };
    
    res.status(statusCode).json(response);
}

export default errorHandler;