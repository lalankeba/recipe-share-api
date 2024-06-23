"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.getComment = exports.getCommentsByRecipe = exports.getComments = exports.createComment = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const comment_model_1 = __importDefault(require("../models/comment-model"));
const recipe_model_1 = __importDefault(require("../models/recipe-model"));
const user_model_1 = __importDefault(require("../models/user-model"));
const comment_validator_1 = require("../validators/comment-validator");
const common_validator_1 = require("../validators/common-validator");
const createComment = async (userId, recipeId, description) => {
    (0, comment_validator_1.validateCommentDescription)(description);
    const userDocument = await fetchUserForComment(userId);
    const recipeDocument = await fetchRecipeForComment(recipeId);
    const userFullName = userDocument.firstName + ' ' + userDocument.lastName;
    const commentUser = {
        userId: userDocument.id,
        userFullName
    };
    const commentDocument = await comment_model_1.default.create({
        description: description.trim(),
        user: commentUser,
        recipeId
    });
    const recipeComment = {
        commentId: commentDocument.id,
        description,
        createdAt: commentDocument.createdAt.toISOString(),
        userId,
        userFullName
    };
    const comments = recipeDocument.comments || [];
    comments.unshift(recipeComment);
    const recentComments = comments.slice(0, 10);
    await recipe_model_1.default.findByIdAndUpdate(recipeId, {
        $set: { comments: recentComments },
        $inc: { totalComments: 1 }
    }, { new: true });
    logger_1.default.info(`Comment created`);
    return commentDocument.toJSON();
};
exports.createComment = createComment;
const getComments = async (page, size) => {
    (0, common_validator_1.validatePaginationDetails)(page, size);
    const comments = await comment_model_1.default
        .find({}, { description: 1, recipeId: 1, user: 1, createdAt: 1 })
        .skip(page * size)
        .limit(size);
    return comments.map(comment => comment.toJSON());
};
exports.getComments = getComments;
const getCommentsByRecipe = async (recipeId, page, size) => {
    const recipe = await recipe_model_1.default.findById(recipeId);
    if (!recipe) {
        throw new app_error_1.default(`Comments cannot be found for invalid recipe id: ${recipeId}`, 400);
    }
    (0, common_validator_1.validatePaginationDetails)(page, size);
    const comments = await comment_model_1.default
        .find({ recipeId })
        .skip(page * size)
        .limit(size);
    return comments.map(comment => comment.toJSON());
};
exports.getCommentsByRecipe = getCommentsByRecipe;
const getComment = async (commentId) => {
    const comment = await comment_model_1.default.findById(commentId);
    if (comment) {
        return comment.toJSON();
    }
    else {
        throw new app_error_1.default(`Comment cannot be found for id: ${commentId}`, 400);
    }
};
exports.getComment = getComment;
const updateComment = async (commentId, userId, recipeId, description, __v) => {
    (0, comment_validator_1.validateCommentDescription)(description);
    await fetchComment(commentId, userId, __v);
    const userDocument = await fetchUserForComment(userId);
    const recipeDocument = await fetchRecipeForComment(recipeId);
    const userFullName = userDocument.firstName + ' ' + userDocument.lastName;
    const commentUser = {
        userId: userDocument.id,
        userFullName
    };
    const updatedCommentDocument = await comment_model_1.default.findByIdAndUpdate(commentId, { $set: { description, user: commentUser }, $inc: { __v: 1 } }, { new: true });
    if (!updatedCommentDocument) {
        throw new app_error_1.default('Failed to update comment.', 500);
    }
    const comments = recipeDocument.comments || [];
    const commentIndex = comments.findIndex(comment => comment.commentId === commentId);
    if (commentIndex !== -1) {
        const updatedRecipeComment = {
            commentId,
            description,
            createdAt: comments[commentIndex].createdAt,
            userId,
            userFullName
        };
        comments[commentIndex] = updatedRecipeComment;
    }
    await recipe_model_1.default.findByIdAndUpdate(recipeId, { $set: { comments } }, { new: true });
    logger_1.default.info(`Comment updated`);
    return updatedCommentDocument.toJSON();
};
exports.updateComment = updateComment;
const fetchUserForComment = async (userId) => {
    const userDocument = await user_model_1.default.findById(userId);
    if (!userDocument) {
        throw new app_error_1.default(`Cannot find the user for user id: ${userId}`, 400);
    }
    return userDocument;
};
const fetchRecipeForComment = async (recipeId) => {
    const recipeDocument = await recipe_model_1.default.findById(recipeId);
    if (!recipeDocument) {
        throw new app_error_1.default(`Cannot find the recipe for recipe id: ${recipeId}`, 400);
    }
    return recipeDocument;
};
const fetchComment = async (commentId, userId, __v) => {
    const commentDocument = await comment_model_1.default.findById(commentId);
    if (!commentDocument) {
        throw new app_error_1.default(`Cannot find the comment for comment id: ${commentId}`, 400);
    }
    if (commentDocument.user.userId !== userId.toString()) {
        throw new app_error_1.default(`Comment cannot be updated by another user other than owner of the comment.`, 401);
    }
    if (commentDocument.__v !== __v) {
        throw new app_error_1.default(`Comment has been modified by another process. Please refresh and try again.`, 409);
    }
    return commentDocument;
};
