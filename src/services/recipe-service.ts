import logger from "../config/logger";
import AppError from "../errors/app-error";
import { DisplayableRecipe, RecipeUser } from "../interfaces/i-recipe";
import categoryModel from "../models/category-model";
import recipeModel, { RecipeDocument } from "../models/recipe-model";
import userModel, { UserDocument } from "../models/user-model";
import { validatePaginationDetails } from "../validators/common-validator";
import { validateCreateRecipeDetails } from "../validators/recipe-validator";

const createRecipe = async (title: string, subTitle: string, picture: string, instructions: string, 
    ingredients: string[], prepTime: string, cookTime: string, additionalTime: string, categoryIds: string[], 
    tags: string[], userId: string): Promise<DisplayableRecipe> => {

    validateCreateRecipeDetails(title, instructions);

    const userDocument: UserDocument | null = await userModel.findById(userId);
    if (!userDocument) {
        throw new AppError(`Cannot find the user. Unable to create recipe for user id: ${userId}`, 400);
    }

    const recipeUser: RecipeUser = {
        userId: userDocument.id,
        userFullName: userDocument.firstName + ' ' + userDocument.lastName
    }

    const categoryDocs = await categoryModel.find({
        _id: { $in: categoryIds }
    }).exec();

    if (!categoryDocs || categoryDocs.length === 0 || categoryDocs.length !== categoryIds.length) {
        throw new AppError(`Some categories were not found. Unable to create recipe.`, 400);
    }
    
    const recipeDocument: RecipeDocument = await recipeModel.create({
        title,
        subTitle,
        picture,
        instructions,
        ingredients,
        times: {
            prepTime,
            cookTime,
            additionalTime
        },
        categories: categoryDocs.map(category => {
            return {
                categoryId: category._id,
                description: category.description
            };
        }),
        tags,
        comments: [],
        totalComments: 0,
        user: recipeUser
    });

    logger.info(`Recipe created`);
    
    return recipeDocument.toJSON();
}

const getRecipes = async (page: number, size: number) => {
    validatePaginationDetails(page, size);
    const recipes = await recipeModel
        .find({}, { title: 1, subTitle: 1, picture: 1, categories: 1, tags: 1, totalComments: 1, user: 1, createdAt: 1 })
        .skip(page * size)
        .limit(size);

    return recipes.map(recipe => recipe.toJSON());
}

const getRecipe = async (recipeId: string) => {
    const recipe = await recipeModel.findById(recipeId);
    if (recipe) {
        return recipe.toJSON();
    } else {
        throw new AppError(`Recipe cannot be found for id: ${recipeId}`, 400);
    }
}

export { createRecipe, getRecipes, getRecipe };