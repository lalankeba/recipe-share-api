"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_error_1 = __importDefault(require("../errors/app-error"));
const notFoundHandler = (req, res, next) => {
    const err = new app_error_1.default('Not Found', 404);
    next(err);
};
exports.default = notFoundHandler;
