import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth-service';

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, gender, email, password } = req.body;
        await authService.register(firstName, lastName, gender, email, password);
        res.status(201).json({ message: `Employee: ${firstName} ${lastName} registered` });
    } catch (err) {
        next(err);
    }
}

export { register };