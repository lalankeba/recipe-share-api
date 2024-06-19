import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { DisplayableRecipe } from "../interfaces/i-recipe";
import * as recipeService from '../services/recipe-service';
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

export { createRecipe };