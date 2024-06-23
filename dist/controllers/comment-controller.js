"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getComment = exports.getComments = exports.createComment = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const commentService = __importStar(require("../services/comment-service"));
const createComment = async (req, res, next) => {
    try {
        logger_1.default.info(`Creating comment...`);
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser.id;
        const { description, recipeId } = req.body;
        const dComment = await commentService.createComment(loggedInUserId, recipeId, description);
        res.status(201).json(dComment);
    }
    catch (err) {
        next(err);
    }
};
exports.createComment = createComment;
const getComments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const size = Math.min(parseInt(req.query.size) || 10, 100);
        const comments = await commentService.getComments(page, size);
        res.status(200).json(comments);
    }
    catch (err) {
        next(err);
    }
};
exports.getComments = getComments;
const getComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const comment = await commentService.getComment(commentId);
        res.status(200).json(comment);
    }
    catch (err) {
        next(err);
    }
};
exports.getComment = getComment;
const updateComment = async (req, res, next) => {
    try {
        logger_1.default.info(`Updating comment...`);
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser.id;
        const commentId = req.params.id;
        const { recipeId, description, __v } = req.body;
        const updatedComment = await commentService.updateComment(commentId, loggedInUserId, recipeId, description, __v);
        res.status(200).json(updatedComment);
    }
    catch (err) {
        next(err);
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res, next) => {
    try {
        logger_1.default.info(`Deleting comment...`);
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser.id;
        const commentId = req.params.id;
        await commentService.deleteComment(commentId, loggedInUserId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteComment = deleteComment;
