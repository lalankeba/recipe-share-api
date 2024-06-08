"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const app_error_1 = __importDefault(require("../errors/app-error"));
const user_model_1 = __importDefault(require("../models/user-model"));
const getUsers = async (page, size) => {
    if (page < 0) {
        throw new app_error_1.default(`The page: ${page} parameter must be 0 or a positive integer`, 400);
    }
    else if (size < 1) {
        throw new app_error_1.default(`The size: ${size} parameter must be a positive integer`, 400);
    }
    const users = await user_model_1.default
        .find({}, { firstName: 1, lastName: 1, gender: 1, email: 1, roles: 1 })
        .skip(page * size)
        .limit(size);
    return users;
};
exports.getUsers = getUsers;
