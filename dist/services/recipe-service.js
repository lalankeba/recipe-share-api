"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecipe = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const category_model_1 = __importDefault(require("../models/category-model"));
const recipe_model_1 = __importDefault(require("../models/recipe-model"));
const user_model_1 = __importDefault(require("../models/user-model"));
const recipe_validator_1 = require("../validators/recipe-validator");
const createRecipe = async (title, subTitle, picture, instructions, ingredients, prepTime, cookTime, additionalTime, categoryIds, tags, userId) => {
    (0, recipe_validator_1.validateCreateRecipeDetails)(title, instructions);
    const userDocument = await user_model_1.default.findById(userId);
    if (!userDocument) {
        throw new app_error_1.default(`Cannot find the user. Unable to create recipe for user id: ${userId}`, 400);
    }
    const recipeUser = {
        userId: userDocument.id,
        userFullName: userDocument.firstName + ' ' + userDocument.lastName
    };
    const categoryDocs = await category_model_1.default.find({
        _id: { $in: categoryIds }
    }).exec();
    if (!categoryDocs || categoryDocs.length === 0 || categoryDocs.length !== categoryIds.length) {
        throw new app_error_1.default(`Some categories were not found. Unable to create recipe.`, 400);
    }
    const recipeDocument = await recipe_model_1.default.create({
        title,
        subTitle,
        picture,
        instructions,
        ingredients,
        times: {
            prepTime,
            cookTime,
            additionalTime
        },
        categories: categoryDocs.map(category => {
            return {
                categoryId: category._id,
                description: category.description
            };
        }),
        tags,
        comments: [],
        totalComments: 0,
        user: recipeUser
    });
    logger_1.default.info(`Recipe created`);
    return recipeDocument.toJSON();
};
exports.createRecipe = createRecipe;
