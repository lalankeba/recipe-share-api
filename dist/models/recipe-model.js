"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipeTimesSchema = new mongoose_1.Schema({
    prepTime: { type: String, required: true },
    cookTime: { type: String, required: true },
    additionalTime: { type: String }
}, { _id: false });
const recipeCategorySchema = new mongoose_1.Schema({
    categoryId: { type: String, required: true, ref: 'Category' },
    description: { type: String, required: true }
}, { _id: false });
const recipeCommentSchema = new mongoose_1.Schema({
    commentId: { type: String, required: true, ref: 'Comment' },
    description: { type: String, required: true },
    createdAt: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    userFullName: { type: String, required: true }
}, { _id: false });
const recipeUserSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, ref: 'User' },
    userFullName: { type: String, required: true }
}, { _id: false });
const recipeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    picture: { type: String },
    instructions: { type: String, required: true },
    ingredients: { type: [String] },
    times: { type: recipeTimesSchema },
    categories: { type: [recipeCategorySchema], required: true },
    tags: { type: [String] },
    comments: { type: [recipeCommentSchema] },
    totalComments: { type: Number },
    user: { type: recipeUserSchema, required: true }
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
const recipeModel = (0, mongoose_1.model)('Recipe', recipeSchema);
exports.default = recipeModel;
