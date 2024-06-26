"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.updateSelf = exports.getUser = exports.getSelf = exports.getUsers = void 0;
const app_error_1 = __importDefault(require("../errors/app-error"));
const user_model_1 = __importDefault(require("../models/user-model"));
const common_validator_1 = require("../validators/common-validator");
const user_validator_1 = require("../validators/user-validator");
const getUsers = async (page, size) => {
    (0, common_validator_1.validatePaginationDetails)(page, size);
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
const updateSelf = async (loggedInUserId, firstName, lastName, gender, __v) => {
    (0, user_validator_1.validateFirstName)(firstName);
    (0, user_validator_1.validateLastName)(lastName);
    (0, user_validator_1.validateGender)(gender);
    (0, common_validator_1.validateVersion)(__v);
    const userDoc = await user_model_1.default.findById(loggedInUserId);
    if (!userDoc) {
        throw new app_error_1.default(`Cannot find the user. Unable to update user for id: ${loggedInUserId}`, 400);
    }
    if (userDoc.__v !== __v) {
        throw new app_error_1.default(`User has been modified by another process. Please refresh and try again.`, 409);
    }
    const updatedUser = await user_model_1.default.findByIdAndUpdate(loggedInUserId, { $set: { firstName, lastName, gender }, $inc: { __v: 1 } }, { new: true });
    if (!updatedUser) {
        throw new app_error_1.default('Failed to update user document.', 500);
    }
    return updatedUser.toJSON();
};
exports.updateSelf = updateSelf;
const updateUser = async (loggedInUserId, userId, firstName, lastName, gender, roles, __v) => {
    if (loggedInUserId === userId) {
        throw new app_error_1.default(`Access denied. Use self API to update yourself`, 401);
    }
    (0, user_validator_1.validateFirstName)(firstName);
    (0, user_validator_1.validateLastName)(lastName);
    (0, user_validator_1.validateGender)(gender);
    (0, user_validator_1.validateRoles)(roles);
    (0, common_validator_1.validateVersion)(__v);
    const userDoc = await user_model_1.default.findById(userId);
    if (!userDoc) {
        throw new app_error_1.default(`Cannot find the user. Unable to update user for id: ${userId}`, 400);
    }
    if (userDoc.__v !== __v) {
        throw new app_error_1.default(`User has been modified by another process. Please refresh and try again.`, 409);
    }
    const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, { $set: { firstName, lastName, gender, roles }, $inc: { __v: 1 } }, { new: true });
    if (!updatedUser) {
        throw new app_error_1.default('Failed to update user document.', 500);
    }
    return updatedUser.toJSON();
};
exports.updateUser = updateUser;
const getAnyUser = async (userId) => {
    const user = await user_model_1.default.findById(userId, { firstName: 1, lastName: 1, gender: 1, email: 1, roles: 1, __v: 1, createdAt: 1, updatedAt: 1 });
    if (user) {
        return user.toJSON();
    }
    else {
        throw new app_error_1.default(`User cannot be found for id: ${userId}`, 400);
    }
};
