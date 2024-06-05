import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth-service';
import { DisplayableUser } from '../interfaces/i-user';
import logger from '../config/logger';

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info(`Creating user...`);
        const { firstName, lastName, gender, email, password } = req.body;
        const dUser: DisplayableUser = await authService.register(firstName, lastName, gender, email, password);
        res.status(201).json(dUser);
    } catch (err) {
        next(err);
    }
}

export { register };