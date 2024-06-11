import { NextFunction, Request, Response } from "express";
import * as userService from '../services/user-service';
import { UserDocument } from "../models/user-model";

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

const getSelf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedInUser = req.user as UserDocument;
        const loggedInUserId = loggedInUser.id;
        const user = await userService.getSelf(loggedInUserId);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedInUser = req.user as UserDocument;
        const loggedInUserId = loggedInUser.id;
        const userId = req.params.id;
        const user = await userService.getUser(loggedInUserId, userId);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

const updateSelf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedInUser = req.user as UserDocument;
        const loggedInUserId = loggedInUser.id;
        const { firstName, lastName, gender, __v } = req.body;
        const updatedUser = await userService.updateSelf(loggedInUserId, firstName, lastName, gender, __v);
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
}

export { getUsers, getSelf, getUser, updateSelf };