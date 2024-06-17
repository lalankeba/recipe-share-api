"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(`Error occurred when accessing ${req.url}`);
    const statusCode = err.statusCode || 500;
    if (statusCode === 404) {
        logger_1.default.error(err.message);
    }
    else {
        logger_1.default.error(err.stack);
    }
    const response = {
        message: err.message || 'Internal Server Error',
    };
    res.status(statusCode).json(response);
};
exports.default = errorHandler;
