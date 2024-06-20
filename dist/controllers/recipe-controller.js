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
exports.getRecipe = exports.getRecipes = exports.createRecipe = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const recipeService = __importStar(require("../services/recipe-service"));
const createRecipe = async (req, res, next) => {
    try {
        logger_1.default.info(`Creating recipe...`);
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser.id;
        const { title, subTitle, picture, instructions, ingredients, prepTime, cookTime, additionalTime, categories, tags } = req.body;
        const dRecipe = await recipeService.createRecipe(title, subTitle, picture, instructions, ingredients, prepTime, cookTime, additionalTime, categories, tags, loggedInUserId);
        res.status(201).json(dRecipe);
    }
    catch (err) {
        next(err);
    }
};
exports.createRecipe = createRecipe;
const getRecipes = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const size = Math.min(parseInt(req.query.size) || 10, 100);
        const recipes = await recipeService.getRecipes(page, size);
        res.status(200).json(recipes);
    }
    catch (err) {
        next(err);
    }
};
exports.getRecipes = getRecipes;
const getRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const recipe = await recipeService.getRecipe(recipeId);
        res.status(200).json(recipe);
    }
    catch (err) {
        next(err);
    }
};
exports.getRecipe = getRecipe;
