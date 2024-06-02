"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = "AppError";
        this.statusCode = 500;
    }
}
exports.default = AppError;
