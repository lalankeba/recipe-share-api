import logger from "../config/logger";
import AppError from "../errors/app-error";
import { CommentUser, DisplayableComment } from "../interfaces/i-comment";
import { RecipeComment } from "../interfaces/i-recipe";
import commentModel, { CommentDocument } from "../models/comment-model";
import recipeModel, { RecipeDocument } from "../models/recipe-model";
import userModel, { UserDocument } from "../models/user-model";
import { validateCommentDescription } from "../validators/comment-validator";
import { validatePaginationDetails } from "../validators/common-validator";

const createComment = async (userId: string, recipeId: string, description: string): Promise<DisplayableComment> => {
    validateCommentDescription(description);

    const userDocument: UserDocument = await fetchUserForComment(userId);
    const recipeDocument: RecipeDocument = await fetchRecipeForComment(recipeId);

    const userFullName = userDocument.firstName + ' ' + userDocument.lastName;
    
    const commentUser: CommentUser = {
        userId: userDocument.id,
        userFullName
    }
    
    const commentDocument: CommentDocument = await commentModel.create({
        description: description.trim(),
        user: commentUser,
        recipeId
    });
    
    const recipeComment: RecipeComment = {
        commentId: commentDocument.id,
        description,
        createdAt: commentDocument.createdAt.toISOString(),
        userId,
        userFullName
    };
    
    const comments = recipeDocument.comments || [];
    comments.unshift(recipeComment);
    const recentComments = comments.slice(0, 10);

    await recipeModel.findByIdAndUpdate(
        recipeId,
        { 
            $set: { comments: recentComments }, 
            $inc: { totalComments: 1 } 
        },
        { new: true }
    );

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

const updateComment = async (commentId: string, userId: string, recipeId: string, description: string, __v: number): Promise<DisplayableComment> => {
    validateCommentDescription(description);

    await fetchCommentForUpdate(commentId, userId, __v);
    const userDocument: UserDocument = await fetchUserForComment(userId);
    const recipeDocument: RecipeDocument = await fetchRecipeForComment(recipeId);

    const userFullName = userDocument.firstName + ' ' + userDocument.lastName;
    
    const commentUser: CommentUser = {
        userId: userDocument.id,
        userFullName
    }

    const updatedCommentDocument = await commentModel.findByIdAndUpdate(
        commentId,
        { $set: { description, user: commentUser }, $inc: { __v: 1 } },
        { new: true }
    );

    if (!updatedCommentDocument) {
        throw new AppError('Failed to update comment.', 500);
    }
    
    const comments = recipeDocument.comments || [];
    const commentIndex = comments.findIndex(comment => comment.commentId === commentId);

    if (commentIndex !== -1) {
        const updatedRecipeComment: RecipeComment = {
            commentId,
            description,
            createdAt: comments[commentIndex].createdAt,
            userId,
            userFullName
        };
        comments[commentIndex] = updatedRecipeComment;
    }

    await recipeModel.findByIdAndUpdate(
        recipeId,
        { $set: { comments } },
        { new: true }
    );

    logger.info(`Comment updated`);
    
    return updatedCommentDocument.toJSON();
}

const deleteComment = async (commentId: string, userId: string) => {
    const commentDocument: CommentDocument = await fetchComment(commentId, userId);
    const recipeId = commentDocument.recipeId;

    const comment = await commentModel.findByIdAndDelete(commentId);
    if (!comment) {
        throw new AppError(`Comment cannot be found for id: ${commentId}`, 404);
    }

    const updatedComments = await getLatestComments(recipeId, 10);

    await recipeModel.findByIdAndUpdate(
        recipeId,
        { $set: { comments: updatedComments }, $inc: { totalComments: -1 } },
        { new: true }
    );

    logger.info(`Comment deleted`);

    return comment.toJSON();
}

const getLatestComments = async (recipeId: string, limit: number): Promise<RecipeComment[]> => {
    const latestCommentDocs: CommentDocument[] = await commentModel.find({ recipeId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    
    const recipeComments: RecipeComment[] = latestCommentDocs.map(commentDocument => {
        return {
            commentId: commentDocument.id,
            description: commentDocument.description,
            createdAt: commentDocument.createdAt.toISOString(),
            userId: commentDocument.user.userId,
            userFullName: commentDocument.user.userFullName
        };
    });

    return recipeComments;
}

const fetchUserForComment = async (userId: string): Promise<UserDocument> => {
    const userDocument: UserDocument | null = await userModel.findById(userId);
    if (!userDocument) {
        throw new AppError(`Cannot find the user for user id: ${userId}`, 400);
    }
    return userDocument;
}

const fetchRecipeForComment = async (recipeId: string): Promise<RecipeDocument> => {
    const recipeDocument: RecipeDocument | null = await recipeModel.findById(recipeId);
    if (!recipeDocument) {
        throw new AppError(`Cannot find the recipe for recipe id: ${recipeId}`, 400);
    }
    return recipeDocument;
}

const fetchComment = async (commentId: string, userId: string): Promise<CommentDocument> => {
    const commentDocument: CommentDocument | null = await commentModel.findById(commentId);
    if (!commentDocument) {
        throw new AppError(`Cannot find the comment for comment id: ${commentId}`, 404);
    }
    if (commentDocument.user.userId !== userId.toString()) {
        throw new AppError(`Comment cannot be modified by another user other than the owner of the comment.`, 401);
    }
    return commentDocument;
}

const fetchCommentForUpdate = async (commentId: string, userId: string, __v: number): Promise<CommentDocument> => {
    const commentDocument: CommentDocument | null = await fetchComment(commentId, userId);
    if (commentDocument.__v !== __v) {
        throw new AppError(`Comment has been modified by another process. Please refresh and try again.`, 409);
    }
    return commentDocument;
}

export { createComment, getComments, getCommentsByRecipe, getComment, updateComment, deleteComment };