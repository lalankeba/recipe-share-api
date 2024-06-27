"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommentDescription = void 0;
const app_error_1 = __importDefault(require("../errors/app-error"));
const validateCommentDescription = (description) => {
    if (!description || description === null || description.trim().length < 2) {
        throw new app_error_1.default('Comment description required', 400);
    }
    if (description.length > 500) {
        throw new app_error_1.default('Comment is too long', 400);
    }
    return true;
};
exports.validateCommentDescription = validateCommentDescription;
