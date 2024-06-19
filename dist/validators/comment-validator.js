"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommentDescription = void 0;
const app_error_1 = __importDefault(require("../errors/app-error"));
const validateCommentDescription = (title) => {
    if (!title || title === null || title.trim().length < 2) {
        throw new app_error_1.default('Comment description required', 400);
    }
    return true;
};
exports.validateCommentDescription = validateCommentDescription;
