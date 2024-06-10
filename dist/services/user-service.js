"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getSelf = exports.getUsers = void 0;
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
    return users.map(user => user.toJSON());
};
exports.getUsers = getUsers;
const getSelf = async (loggedInUserId) => {
    return getAnyUser(loggedInUserId);
};
exports.getSelf = getSelf;
const getUser = async (loggedInUserId, userId) => {
    if (loggedInUserId === userId) {
        throw new app_error_1.default(`Access denied. Use self API to get yourself`, 400);
    }
    return getAnyUser(userId);
};
exports.getUser = getUser;
const getAnyUser = async (userId) => {
    const user = await user_model_1.default.findById(userId, { firstName: 1, lastName: 1, gender: 1, email: 1, roles: 1, createdAt: 1, updatedAt: 1 });
    if (user) {
        return user.toJSON();
    }
    else {
        throw new app_error_1.default(`User cannot be found for id: ${userId}`, 400);
    }
};
