"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategoryDescription = void 0;
const app_error_1 = __importDefault(require("../errors/app-error"));
const validateCategoryDescription = (description) => {
    if (!description || description === null || description.trim() === "") {
        throw new app_error_1.default('Description required', 400);
    }
    return true;
};
exports.validateCategoryDescription = validateCategoryDescription;
