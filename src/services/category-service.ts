import logger from "../config/logger";
import AppError from "../errors/app-error";
import { DisplayableCategory } from "../interfaces/i-category";
import categoryModel, { CategoryDocument } from "../models/category-model";
import { validateDescription } from "../validators/category-validator";
import { validatePaginationDetails, validateVersion } from "../validators/common-validator";

const createCategory = async (description: string): Promise<DisplayableCategory> => {
    validateDescription(description);

    const existingCategory = await categoryModel.findOne({description});
    if (existingCategory) {
        throw new AppError(`Existing category found for: ${description}`, 400);
    }
    
    const categoryDocument: CategoryDocument = await categoryModel.create({ 
        description: description.trim()
    });

    logger.info(`Category created for ${description}`);
    
    return categoryDocument.toJSON();
}

const getCategories = async (page: number, size: number) => {
    validatePaginationDetails(page, size);
    const categories = await categoryModel
        .find({}, { description: 1 })
        .skip(page * size)
        .limit(size);

    return categories.map(category => category.toJSON());
}

const getCategory = async (categoryId: string): Promise<DisplayableCategory> => {
    const category = await categoryModel.findById(categoryId, { description: 1, __v: 1, createdAt: 1, updatedAt: 1 });
    if (category) {
        return category.toJSON();
    } else {
        throw new AppError(`Category cannot be found for id: ${categoryId}`, 400);
    }
}

const updateCategory = async (categoryId: string, description: string, __v: number): Promise<DisplayableCategory> => {
    validateDescription(description);
    validateVersion(__v);

    const categoryDoc: CategoryDocument | null = await categoryModel.findById(categoryId);

    if (!categoryDoc) {
        throw new AppError(`Cannot find the category. Unable to update the category for id: ${categoryId}`, 400);
    }

    if (categoryDoc.__v !== __v) {
        throw new AppError(`Category has been modified by another process. Please refresh and try again.`, 409);
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
        categoryId,
        { $set: { description }, $inc: { __v: 1 } },
        { new: true }
    );
    
    if (!updatedCategory) {
        throw new AppError('Failed to update category document.', 500);
    }

    return updatedCategory.toJSON();
}

export { createCategory, getCategories, getCategory, updateCategory };