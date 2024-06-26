"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelfRecipes = exports.getRecipesByUser = exports.updateUser = exports.updateSelf = exports.getUser = exports.getSelf = exports.getUsers = void 0;
const userService = __importStar(require("../services/user-service"));
const recipeService = __importStar(require("../services/recipe-service"));
const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const size = Math.min(parseInt(req.query.size) || 5, 100);
        const users = await userService.getUsers(page, size);
        res.status(200).json(users);
    }
    catch (err) {
        next(err);
    }
};
exports.getUsers = getUsers;
const getSelf = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser.id;
        const user = await userService.getSelf(loggedInUserId);
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.getSelf = getSelf;
const getUser = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser.id;
        const userId = req.params.id;
        const user = await userService.getUser(loggedInUserId, userId);
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.getUser = getUser;
const updateSelf = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser.id;
        const { firstName, lastName, gender, __v } = req.body;
        const updatedUser = await userService.updateSelf(loggedInUserId, firstName, lastName, gender, __v);
        res.status(200).json(updatedUser);
    }
    catch (err) {
        next(err);
    }
};
exports.updateSelf = updateSelf;
const updateUser = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser.id;
        const userId = req.params.id;
        const { firstName, lastName, gender, roles, __v } = req.body;
        const updatedUser = await userService.updateUser(loggedInUserId, userId, firstName, lastName, gender, roles, __v);
        res.status(200).json(updatedUser);
    }
    catch (err) {
        next(err);
    }
};
exports.updateUser = updateUser;
const getRecipesByUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const page = parseInt(req.query.page) || 0;
        const size = Math.min(parseInt(req.query.size) || 10, 100);
        const recipes = await recipeService.getRecipesByUser(userId, page, size);
        res.status(200).json(recipes);
    }
    catch (err) {
        next(err);
    }
};
exports.getRecipesByUser = getRecipesByUser;
const getSelfRecipes = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser.id;
        const page = parseInt(req.query.page) || 0;
        const size = Math.min(parseInt(req.query.size) || 10, 100);
        const recipes = await recipeService.getRecipesByUser(loggedInUserId, page, size);
        res.status(200).json(recipes);
    }
    catch (err) {
        next(err);
    }
};
exports.getSelfRecipes = getSelfRecipes;
