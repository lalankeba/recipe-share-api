import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import IUser from '../interfaces/i-user';

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: IUser, info: any) => {
        if (err || !user) {
            const message = info?.message || 'Unauthorized';
            return res.status(401).json({ message });
        }
        req.user = user;
        next();
    })(req, res, next);
};

export default authenticateJwt;