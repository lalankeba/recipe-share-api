import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { DisplayableComment } from "../interfaces/i-comment";
import * as commentService from '../services/comment-service';
import { UserDocument } from "../models/user-model";

const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info(`Creating comment...`);

        const loggedInUser = req.user as UserDocument;
        const loggedInUserId = loggedInUser.id;

        const { description, recipeId } = req.body;
        const dComment: DisplayableComment = await commentService.createComment(loggedInUserId, recipeId, description);
        res.status(201).json(dComment);
    } catch (err) {
        next(err);
    }
}

export { createComment };