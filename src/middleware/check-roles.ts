import { NextFunction, Request, Response } from "express";
import Role from "../enums/role";
import IUser from "../interfaces/i-user";

const checkRoles = (requiredRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser | undefined;
    if (!user) {
        return res.status(403).json({ message: "Access denied. User not authenticated." });
    }
    const userRoles: Role[] = user.roles;
    const hasRoles = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRoles) {
        return res.status(403).json({ message: `Access denied. You don't have necessary permisions.` });
    }
    next();
}

export default checkRoles;