"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_model_1 = __importDefault(require("./user-model"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const recipe_model_1 = __importDefault(require("./recipe-model"));
const commentUserSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, ref: 'User' },
    userFullName: { type: String, required: true }
}, { _id: false });
const commentSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
    user: { type: commentUserSchema, required: true },
    recipeId: { type: String, required: true, ref: 'Recipe' },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, { _id, ...rest }) => ({
            id: _id,
            ...rest
        })
    },
    versionKey: '__v'
});
commentSchema.pre('save', async function (next) {
    const comment = this;
    // Validate userId
    const user = await user_model_1.default.findById(comment.user.userId);
    if (!user) {
        return next(new app_error_1.default(`User not found for userId: ${comment.user.userId}`, 400));
    }
    // Validate recipeId
    const recipe = await recipe_model_1.default.findById(comment.recipeId);
    if (!recipe) {
        return next(new app_error_1.default(`Recipe not found for recipeId: ${comment.recipeId}`, 400));
    }
    next();
});
const commentModel = (0, mongoose_1.model)('Comment', commentSchema);
exports.default = commentModel;
