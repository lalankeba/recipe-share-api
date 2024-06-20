import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { DisplayableRecipe } from "../interfaces/i-recipe";
import * as recipeService from '../services/recipe-service';
import * as commentService from '../services/comment-service';
import { UserDocument } from "../models/user-model";

const createRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info(`Creating recipe...`);

        const loggedInUser = req.user as UserDocument;
        const loggedInUserId = loggedInUser.id;

        const { title, subTitle, picture, instructions, ingredients, prepTime, cookTime, additionalTime, categories, tags } = req.body;
        const dRecipe: DisplayableRecipe = await recipeService.createRecipe(title, subTitle, picture, instructions, 
            ingredients, prepTime, cookTime, additionalTime, categories, tags, loggedInUserId);
        
        res.status(201).json(dRecipe);
    } catch (err) {
        next(err);
    }
}

const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const size = Math.min(parseInt(req.query.size as string) || 10, 100);
        
        const recipes = await recipeService.getRecipes(page, size);
        res.status(200).json(recipes);
    } catch (err) {
        next(err);
    }
}

const getRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipeId = req.params.id;
        const recipe = await recipeService.getRecipe(recipeId);
        res.status(200).json(recipe);
    } catch (err) {
        next(err);
    }
}

const getCommentsByRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipeId = req.params.id;
        const page = parseInt(req.query.page as string) || 0;
        const size = Math.min(parseInt(req.query.size as string) || 10, 100);
        
        const comments = await commentService.getCommentsByRecipe(recipeId, page, size);
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
}

export { createRecipe, getRecipes, getRecipe, getCommentsByRecipe };