"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.getCategory = exports.getCategories = exports.createCategory = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const category_model_1 = __importDefault(require("../models/category-model"));
const category_validator_1 = require("../validators/category-validator");
const common_validator_1 = require("../validators/common-validator");
const createCategory = async (description) => {
    (0, category_validator_1.validateCategoryDescription)(description);
    const existingCategory = await category_model_1.default.findOne({ description });
    if (existingCategory) {
        throw new app_error_1.default(`Existing category found for: ${description}`, 400);
    }
    const categoryDocument = await category_model_1.default.create({
        description: description.trim()
    });
    logger_1.default.info(`Category created for ${description}`);
    return categoryDocument.toJSON();
};
exports.createCategory = createCategory;
const getCategories = async (page, size) => {
    (0, common_validator_1.validatePaginationDetails)(page, size);
    const categories = await category_model_1.default
        .find({}, { description: 1 })
        .skip(page * size)
        .limit(size);
    return categories.map(category => category.toJSON());
};
exports.getCategories = getCategories;
const getCategory = async (categoryId) => {
    const category = await category_model_1.default.findById(categoryId, { description: 1, __v: 1, createdAt: 1, updatedAt: 1 });
    if (category) {
        return category.toJSON();
    }
    else {
        throw new app_error_1.default(`Category cannot be found for id: ${categoryId}`, 400);
    }
};
exports.getCategory = getCategory;
const updateCategory = async (categoryId, description, __v) => {
    (0, category_validator_1.validateCategoryDescription)(description);
    (0, common_validator_1.validateVersion)(__v);
    description = description.trim();
    const categoryDoc = await category_model_1.default.findById(categoryId);
    if (!categoryDoc) {
        throw new app_error_1.default(`Cannot find the category. Unable to update the category for id: ${categoryId}`, 400);
    }
    if (categoryDoc.__v !== __v) {
        throw new app_error_1.default(`Category has been modified by another process. Please refresh and try again.`, 409);
    }
    const similarCategory = await category_model_1.default.findOne({
        description,
        _id: { $ne: categoryId }
    });
    if (similarCategory) {
        throw new app_error_1.default(`A category with the description "${description}" already exists. Cannot update the category.`, 400);
    }
    const updatedCategory = await category_model_1.default.findByIdAndUpdate(categoryId, { $set: { description }, $inc: { __v: 1 } }, { new: true });
    if (!updatedCategory) {
        throw new app_error_1.default('Failed to update category document.', 500);
    }
    return updatedCategory.toJSON();
};
exports.updateCategory = updateCategory;
