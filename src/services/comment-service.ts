import logger from "../config/logger";
import AppError from "../errors/app-error";
import { CommentUser, DisplayableComment } from "../interfaces/i-comment";
import commentModel, { CommentDocument } from "../models/comment-model";
import recipeModel from "../models/recipe-model";
import userModel, { UserDocument } from "../models/user-model";
import { validateCommentDescription } from "../validators/comment-validator";
import { validatePaginationDetails } from "../validators/common-validator";

const createComment = async (userId: string, recipeId: string, description: string): Promise<DisplayableComment> => {
    validateCommentDescription(description);

    const userDocument: UserDocument | null = await userModel.findById(userId);
    if (!userDocument) {
        throw new AppError(`Cannot find the user. Unable to create comment for user id: ${userId}`, 400);
    }
    const commentUser: CommentUser = {
        userId: userDocument.id,
        userFullName: userDocument.firstName + ' ' + userDocument.lastName
    }
    
    const commentDocument: CommentDocument = await commentModel.create({
        description: description.trim(),
        user: commentUser,
        recipeId
    });

    logger.info(`Comment created`);
    
    return commentDocument.toJSON();
}

const getComments = async (page: number, size: number) => {
    validatePaginationDetails(page, size);
    const comments = await commentModel
        .find({}, { description: 1, recipeId: 1, user: 1, createdAt: 1 })
        .skip(page * size)
        .limit(size);

    return comments.map(comment => comment.toJSON());
}

const getCommentsByRecipe = async (recipeId: string, page: number, size: number) => {
    const recipe = await recipeModel.findById(recipeId);
    if (!recipe) {
        throw new AppError(`Comments cannot be found for invalid recipe id: ${recipeId}`, 400);
    }
    validatePaginationDetails(page, size);

    const comments = await commentModel
        .find({ recipeId })
        .skip(page * size)
        .limit(size);

    return comments.map(comment => comment.toJSON());
}

const getComment = async (commentId: string) => {
    const comment = await commentModel.findById(commentId);
    if (comment) {
        return comment.toJSON();
    } else {
        throw new AppError(`Comment cannot be found for id: ${commentId}`, 400);
    }
}

export { createComment, getComments, getCommentsByRecipe, getComment };