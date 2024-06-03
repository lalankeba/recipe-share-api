import { Request, Response, NextFunction } from 'express';
import AppError from "../errors/app-error";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const err = new AppError('Not Found');
    err.statusCode = 404;
    next(err);
}

export default notFoundHandler;