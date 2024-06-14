"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVersion = exports.validatePaginationDetails = void 0;
const app_error_1 = __importDefault(require("../errors/app-error"));
const validatePaginationDetails = (page, size) => {
    validatePage(page);
    validateSize(size);
    return true;
};
exports.validatePaginationDetails = validatePaginationDetails;
const validatePage = (page) => {
    if (page < 0) {
        throw new app_error_1.default(`The page: ${page} parameter must be 0 or a positive integer`, 400);
    }
    return true;
};
const validateSize = (size) => {
    if (size < 1) {
        throw new app_error_1.default(`The size: ${size} parameter must be a positive integer`, 400);
    }
    return true;
};
const validateVersion = (__v) => {
    if (__v === null || __v === undefined) {
        throw new app_error_1.default('Version required', 400);
    }
    return true;
};
exports.validateVersion = validateVersion;
