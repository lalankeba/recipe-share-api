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

const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const size = Math.min(parseInt(req.query.size as string) || 10, 100);
        
        const comments = await commentService.getComments(page, size);
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
}

const getComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.id;
        const comment = await commentService.getComment(commentId);
        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
}

export { createComment, getComments, getComment };