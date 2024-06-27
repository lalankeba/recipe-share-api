import mongoose from "mongoose";
import recipeModel, { RecipeDocument } from '../../src/models/recipe-model';
import { DisplayableRecipe } from "../../src/interfaces/i-recipe";
import * as recipeService from '../../src/services/recipe-service';
import AppError from "../../src/errors/app-error";
import Role from "../../src/enums/role";
import userModel, { UserDocument } from "../../src/models/user-model";
import categoryModel from "../../src/models/category-model";

jest.mock('../../src/models/recipe-model');
jest.mock('../../src/models/user-model');
jest.mock('../../src/models/category-model');

describe('recipe', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    const toJSON = function(this: RecipeDocument) {
        const { _id, ...rest } = this;
        return { ...rest, id: _id };
    };

    const toJSONForUser = function(this: UserDocument) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, _id, ...rest } = this;
        return { ...rest, id: _id };
    };

    it('Should create a new recipe', async () => {
        // Arrange
        const userDoc = getTestUserDoc();
        const categoryDoc = getTestCategoryDoc();

        const title = 'Chicken curry';
        const instructions = 'Season the chicken pieces with a pinch of salt and pepper. Heat oil in a large pan or pot over medium heat. Add cumin seeds and let them sizzle for a few seconds.';
        const categoryIds = [categoryDoc._id.toString()];
        const userId = userDoc._id.toString();
        const recipeDoc = getTestRecipeDoc(title, instructions, categoryIds, userId);

        const execMock = (categoryModel.create as jest.Mock).mockResolvedValue([categoryDoc]);
        (categoryModel.find as jest.Mock).mockImplementation(() => ({ exec: execMock }));
        (userModel.findById as jest.Mock).mockResolvedValue(userDoc);
        (recipeModel.create as jest.Mock).mockResolvedValue(recipeDoc);

        // Act
        const createdRecipe: DisplayableRecipe = await recipeService.createRecipe(title, recipeDoc.subTitle, 
            recipeDoc.picture, instructions, recipeDoc.ingredients, recipeDoc.prepTime, recipeDoc.cookTime, 
            recipeDoc.additionalTime, categoryIds, recipeDoc.tags, userId);

        // Assert
        expect(createdRecipe).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(createdRecipe.id)).toBe(true);
        expect(createdRecipe).toHaveProperty('title');
        expect(createdRecipe.title).toEqual(title);
        expect(createdRecipe).toHaveProperty('subTitle');
        expect(createdRecipe.subTitle).toEqual(recipeDoc.subTitle);
    });

    const invalidGetParams: [string, string][] = [
        ['', 'instructions to cook'], // title is empty
        ['Chicken curry', ''], // instructions is empty
    ];
    test.each(invalidGetParams)('Should not create a new recipe with invalid title:%s, instructions:%s', async (title, instructions) => {
        // Arrange
        const subTitle = 'Asian chicken curry';
        const picture = 'chicken-curry.jpg';
        const ingredients = ['1 lb (450 g) chicken', '2 tablespoons oil', '1 large onion, finely chopped', '3 cloves garlic, minced'];
        const prepTime = '15 mins';
        const cookTime = '30 mins';
        const additionalTime = '5 mins';
        const categoryIds = [new mongoose.Types.ObjectId().toString()];
        const tags = ['chicken', 'curry', 'spicy'];
        const userId = new mongoose.Types.ObjectId().toString();
    
        // Act & Assert
        await expect(recipeService.createRecipe(title, subTitle, picture, instructions, ingredients, prepTime, cookTime, additionalTime, categoryIds, tags, userId))
            .rejects.toThrow(AppError);
    });

    it('Should not create a new recipe with invalid user', async () => {
        // Arrange
        const userDoc = getTestUserDoc();
        const categoryDoc = getTestCategoryDoc();

        const title = 'Chicken curry';
        const subTitle = 'Asian chicken curry';
        const picture = 'chicken-curry.jpg';
        const instructions = 'Season the chicken pieces with a pinch of salt and pepper. Heat oil in a large pan or pot over medium heat. Add cumin seeds and let them sizzle for a few seconds.';
        const ingredients = ['1 lb (450 g) chicken', '2 tablespoons oil', '1 large onion, finely chopped', '3 cloves garlic, minced'];
        const prepTime = '15 mins';
        const cookTime = '30 mins';
        const additionalTime = '5 mins';
        const categoryIds = [categoryDoc._id.toString()];
        const tags = ['chicken', 'curry', 'spicy'];
        const userId = userDoc._id.toString();

        (userModel.findById as jest.Mock).mockResolvedValue(undefined);

        // Act & Assert
        await expect(recipeService.createRecipe(title, subTitle, picture, instructions, ingredients, prepTime, cookTime, additionalTime, categoryIds, tags, userId))
            .rejects.toThrow(AppError);
        await expect(recipeService.createRecipe(title, subTitle, picture, instructions, ingredients, prepTime, cookTime, additionalTime, categoryIds, tags, userId))
            .rejects.toThrow(
                expect.objectContaining({ message: expect.stringMatching(/^Cannot find the user./) })
            );
    });

    it('Should not create a new recipe with invalid categories', async () => {
        // Arrange
        const userDoc = getTestUserDoc();
        const categoryDoc = getTestCategoryDoc();

        const title = 'Chicken curry';
        const instructions = 'Season the chicken pieces with a pinch of salt and pepper. Heat oil in a large pan or pot over medium heat. Add cumin seeds and let them sizzle for a few seconds.';
        const categoryIds = [new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString()];
        const userId = userDoc._id.toString();
        const recipeDoc = getTestRecipeDoc(title, instructions, categoryIds, userId);

        const execMock = (categoryModel.create as jest.Mock).mockResolvedValue([categoryDoc]);
        (categoryModel.find as jest.Mock).mockImplementation(() => ({ exec: execMock }));
        (userModel.findById as jest.Mock).mockResolvedValue(userDoc);
        (recipeModel.create as jest.Mock).mockResolvedValue(recipeDoc);

        // Act & Assert
        await expect(recipeService.createRecipe(title, recipeDoc.subTitle, recipeDoc.picture, instructions, recipeDoc.ingredients, recipeDoc.prepTime, recipeDoc.cookTime, recipeDoc.additionalTime, categoryIds, recipeDoc.tags, userId))
            .rejects.toThrow(AppError);
        await expect(recipeService.createRecipe(title, recipeDoc.subTitle, recipeDoc.picture, instructions, recipeDoc.ingredients, recipeDoc.prepTime, recipeDoc.cookTime, recipeDoc.additionalTime, categoryIds, recipeDoc.tags, userId))
            .rejects.toThrow(
                expect.objectContaining({ message: expect.stringMatching(/^Some categories were not found./) })
            );
    });

    it('Should get list of recipes', async () => {
        // Arrange
        const userDoc = getTestUserDoc();
        const categoryDoc = getTestCategoryDoc();

        const instructions = 'Season the chicken pieces with a pinch of salt and pepper. Heat oil in a large pan or pot over medium heat. Add cumin seeds and let them sizzle for a few seconds.';
        const categoryIds = [categoryDoc._id.toString()];
        const userId = userDoc._id.toString();

        const recipeDocs = [
            getTestRecipeDoc('Fish curry', instructions, categoryIds, userId),
            getTestRecipeDoc('Vegetable Soup', instructions, categoryIds, userId),
            getTestRecipeDoc('Mango curry', instructions, categoryIds, userId),
            getTestRecipeDoc('Fruit', instructions, categoryIds, userId),
            getTestRecipeDoc('Faluda drink', instructions, categoryIds, userId),
        ];

        const findMock = jest.fn().mockReturnThis();
        const skipMock = jest.fn().mockReturnThis();
        const limitMock = (recipeModel.create as jest.Mock).mockResolvedValue(recipeDocs);
        recipeModel.find = findMock;
        (recipeModel.find as jest.Mock).mockImplementation(() => ({
            skip: skipMock,
            limit: limitMock,
        }));

        // Act
        const recipes = await recipeService.getRecipes(0, recipeDocs.length);

        // Assert
        expect(Array.isArray(recipes)).toBe(true);
        expect(recipes.length).toBe(recipeDocs.length);
        recipeDocs.forEach((recipe) => {
            expect(recipe).toHaveProperty('title');
        });
    });

    it('Should get list of recipes by user', async () => {
        // Arrange
        const userDoc = getTestUserDoc();
        const categoryDoc = getTestCategoryDoc();

        const instructions = 'Season the chicken pieces with a pinch of salt and pepper. Heat oil in a large pan or pot over medium heat. Add cumin seeds and let them sizzle for a few seconds.';
        const categoryIds = [categoryDoc._id.toString()];
        const userId = userDoc._id.toString();

        const recipeDocs = [
            getTestRecipeDoc('Fish curry', instructions, categoryIds, userId),
            getTestRecipeDoc('Vegetable Soup', instructions, categoryIds, userId),
            getTestRecipeDoc('Mango curry', instructions, categoryIds, userId),
            getTestRecipeDoc('Fruit', instructions, categoryIds, userId),
            getTestRecipeDoc('Faluda drink', instructions, categoryIds, userId),
        ];

        const findMock = jest.fn().mockReturnThis();
        const skipMock = jest.fn().mockReturnThis();
        const limitMock = (recipeModel.create as jest.Mock).mockResolvedValue(recipeDocs);
        recipeModel.find = findMock;
        (recipeModel.find as jest.Mock).mockImplementation(() => ({
            skip: skipMock,
            limit: limitMock,
        }));
        (userModel.findById as jest.Mock).mockResolvedValue(userDoc);

        // Act
        const recipes = await recipeService.getRecipesByUser(userId, 0, recipeDocs.length);

        // Assert
        expect(Array.isArray(recipes)).toBe(true);
        expect(recipes.length).toBe(recipeDocs.length);
        recipeDocs.forEach((recipe) => {
            expect(recipe).toHaveProperty('title');
        });
    });

    it('Should not get list of recipes for invalid user', async () => {
        // Arrange
        const userDoc = getTestUserDoc();
        const userId = userDoc._id.toString();

        (userModel.findById as jest.Mock).mockResolvedValue(undefined);

        // Act & Assert
        await expect(recipeService.getRecipesByUser(userId, 0, 5))
            .rejects.toThrow(AppError);
    });

    it('Should get a recipe by id', async () => {
        // Arrange
        const userDoc = getTestUserDoc();
        const categoryDoc = getTestCategoryDoc();

        const title = 'Chicken curry';
        const instructions = 'Season the chicken pieces with a pinch of salt and pepper. Heat oil in a large pan or pot over medium heat. Add cumin seeds and let them sizzle for a few seconds.';
        const categoryIds = [categoryDoc._id.toString()];
        const userId = userDoc._id.toString();
        const recipeDoc = getTestRecipeDoc(title, instructions, categoryIds, userId);

        (recipeModel.findById as jest.Mock).mockResolvedValue(recipeDoc);

        // Act
        const recipe: DisplayableRecipe = await recipeService.getRecipe(recipeDoc._id.toString());

        // Assert
        expect(recipe).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(recipe.id)).toBe(true);
        expect(recipe).toHaveProperty('title');
        expect(recipe.title).toEqual(title);
    });

    it('Should not get a recipe for invalid recipe id', async () => {
        // Arrange
        const recipeId = new mongoose.Types.ObjectId().toString();

        (recipeModel.findById as jest.Mock).mockResolvedValue(undefined);

        // Act & Assert
        await expect(recipeService.getRecipe(recipeId))
            .rejects.toThrow(AppError);
    });

    const getTestRecipeDoc = (title: string, instructions: string, categoryIds: string[], userId: string) => {
        const recipeId = new mongoose.Types.ObjectId();
        const subTitle = 'Asian chicken curry';
        const picture = 'chicken-curry.jpg';
        const ingredients = ['1 lb (450 g) chicken', '2 tablespoons oil', '1 large onion, finely chopped', '3 cloves garlic, minced'];
        const prepTime = '15 mins';
        const cookTime = '30 mins';
        const additionalTime = '5 mins';
        const tags = ['chicken', 'curry', 'spicy'];
        
        const recipeDoc = {
            _id: recipeId,
            title,
            subTitle,
            picture,
            instructions,
            ingredients,
            prepTime,
            cookTime,
            additionalTime,
            categoryIds,
            tags,
            userId,
            toJSON
        };

        return recipeDoc;
    }

    const getTestUserDoc = () => {
        const id = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = "MALE";
        const email = "john@example.com";
        const hashedPassword = "7b815af81a6dca3a517c";
        const roles = [Role.User];

        const userDoc = {
            _id: id,
            firstName,
            lastName,
            gender,
            email,
            password: hashedPassword,
            roles,
            toJSONForUser
        };

        return userDoc;
    }

    const getTestCategoryDoc = () => {
        const id = new mongoose.Types.ObjectId();
        const description = 'Curry';
        
        const categoryDoc = {
            _id: id,
            description,
            toJSON
        };

        return categoryDoc;
    }


});
