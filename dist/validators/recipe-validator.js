"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecipeInstructions = exports.validateRecipeTitle = exports.validateCreateRecipeDetails = void 0;
const app_error_1 = __importDefault(require("../errors/app-error"));
const validateCreateRecipeDetails = (title, instructions) => {
    validateRecipeTitle(title);
    validateRecipeInstructions(instructions);
    return true;
};
exports.validateCreateRecipeDetails = validateCreateRecipeDetails;
const validateRecipeTitle = (title) => {
    if (!title || title === null || title.trim() === "") {
        throw new app_error_1.default('Title required', 400);
    }
    return true;
};
exports.validateRecipeTitle = validateRecipeTitle;
const validateRecipeInstructions = (instructions) => {
    if (!instructions || instructions === null || instructions.trim() === "") {
        throw new app_error_1.default('Instructions required', 400);
    }
    return true;
};
exports.validateRecipeInstructions = validateRecipeInstructions;
