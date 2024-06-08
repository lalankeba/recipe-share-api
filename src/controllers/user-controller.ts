import { NextFunction, Request, Response } from "express";
import AppError from "../errors/app-error";
import * as userService from '../services/user-service';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const size = Math.min(parseInt(req.query.size as string) || 5, 100);
        
        const users = await userService.getUsers(page, size);
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

export { getUsers };