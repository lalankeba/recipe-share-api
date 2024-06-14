import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { DisplayableCategory } from "../interfaces/i-category";
import * as categoryService from '../services/category-service';

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info(`Creating category...`);
        const { description } = req.body;
        const dCategory: DisplayableCategory = await categoryService.createCategory(description);
        res.status(201).json(dCategory);
    } catch (err) {
        next(err);
    }
}

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const size = Math.min(parseInt(req.query.size as string) || 10, 100);
        
        const categories = await categoryService.getCategories(page, size);
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
}

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryService.getCategory(categoryId);
        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
}

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        const { description, __v } = req.body;
        const updatedCategory = await categoryService.updateCategory(categoryId, description, __v);
        res.status(200).json(updatedCategory);
    } catch (err) {
        next(err);
    }
}

export { createCategory, getCategories, getCategory, updateCategory };