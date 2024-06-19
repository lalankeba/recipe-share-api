"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const comment_model_1 = __importDefault(require("../models/comment-model"));
const comment_validator_1 = require("../validators/comment-validator");
const createComment = async (userId, recipeId, description) => {
    (0, comment_validator_1.validateCommentDescription)(description);
    const commentDocument = await comment_model_1.default.create({
        description: description.trim(),
        userId,
        recipeId
    });
    logger_1.default.info(`Comment created`);
    return commentDocument.toJSON();
};
exports.createComment = createComment;
