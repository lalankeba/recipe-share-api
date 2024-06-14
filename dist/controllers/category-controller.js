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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.getCategory = exports.getCategories = exports.createCategory = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const categoryService = __importStar(require("../services/category-service"));
const createCategory = async (req, res, next) => {
    try {
        logger_1.default.info(`Creating category...`);
        const { description } = req.body;
        const dCategory = await categoryService.createCategory(description);
        res.status(201).json(dCategory);
    }
    catch (err) {
        next(err);
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const size = Math.min(parseInt(req.query.size) || 10, 100);
        const categories = await categoryService.getCategories(page, size);
        res.status(200).json(categories);
    }
    catch (err) {
        next(err);
    }
};
exports.getCategories = getCategories;
const getCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryService.getCategory(categoryId);
        res.status(200).json(category);
    }
    catch (err) {
        next(err);
    }
};
exports.getCategory = getCategory;
const updateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const { description, __v } = req.body;
        const updatedCategory = await categoryService.updateCategory(categoryId, description, __v);
        res.status(200).json(updatedCategory);
    }
    catch (err) {
        next(err);
    }
};
exports.updateCategory = updateCategory;
