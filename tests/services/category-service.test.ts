import mongoose from "mongoose";
import categoryModel from '../../src/models/category-model';
import { DisplayableCategory } from "../../src/interfaces/i-category";
import * as categoryService from '../../src/services/category-service';
import AppError from "../../src/errors/app-error";

jest.mock('../../src/models/category-model');

describe('category', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    const toJSON = function(this: any) {
        const { _id, ...rest } = this;
        return { ...rest, id: _id };
    };

    it('Should create a new category', async () => {
        // Arrange
        const id = new mongoose.Types.ObjectId();
        const description = 'Curry';
        
        const categoryDoc = {
            _id: id,
            description,
            toJSON
        };

        (categoryModel.create as jest.Mock).mockResolvedValue(categoryDoc);

        // Act
        const createdCategory: DisplayableCategory = await categoryService.createCategory(description);
        console.log(createdCategory);

        // Assert
        expect(createdCategory).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(createdCategory.id)).toBe(true);
        expect(createdCategory).toHaveProperty('description');
        expect(createdCategory.description).toEqual(description);
    });

    const invalidUserDetails: [string|undefined|null][] = [
        [''], // empty description
        ["    "], // empty description
        [undefined], // undefined
        [null], // null
    ];
    test.each(invalidUserDetails)('Should not create a new category with invalid description:%s', async (description) => {
        // Act & Assert
        await expect(categoryService.createCategory(description as string))
            .rejects.toThrow(AppError);
    });

    it('Should not create a category with same description', async () => {
        // Arrange
        const id = new mongoose.Types.ObjectId();
        const description = 'Curry';

        const categoryDoc = {
            _id: id,
            description,
            toJSON
        };

        (categoryModel.findOne as jest.Mock).mockResolvedValue(categoryDoc);

        // Act & Assert
        await expect(categoryService.createCategory(description))
            .rejects.toThrow(AppError);
        await expect(categoryService.createCategory(description))
            .rejects.toThrow(
                expect.objectContaining({ message: expect.stringMatching(/^Existing category found for/) })
            );
    });

    it('Should get list of categories', async () => {
        // Arrange
        const existingCategories = [
            { _id: new mongoose.Types.ObjectId(), description: 'Curry', toJSON },
            { _id: new mongoose.Types.ObjectId(), description: 'Dessert', toJSON },
            { _id: new mongoose.Types.ObjectId(), description: 'Drink', toJSON },
            { _id: new mongoose.Types.ObjectId(), description: 'Starter', toJSON },
            { _id: new mongoose.Types.ObjectId(), description: 'Soup', toJSON },
            { _id: new mongoose.Types.ObjectId(), description: 'Pudding', toJSON },
        ];
        const findMock = jest.fn().mockReturnThis();
        const skipMock = jest.fn().mockReturnThis();
        const limitMock = (categoryModel.create as jest.Mock).mockResolvedValue(existingCategories);

        categoryModel.find = findMock;
        (categoryModel.find as jest.Mock).mockImplementation(() => ({
            skip: skipMock,
            limit: limitMock,
        }));

        // Act
        const categories = await categoryService.getCategories(0, existingCategories.length);

        // Assert
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(existingCategories.length);
        existingCategories.forEach((category) => {
            expect(category).toHaveProperty('description');
        });
    });

    it('Should get a category by id', async () => {
        // Arrange
        const id = new mongoose.Types.ObjectId();
        const description = 'Curry';
        const mockCategory = { 
            _id: id, 
            description,
            toJSON
        };
        (categoryModel.findById as jest.Mock).mockResolvedValue(mockCategory);

        // Act
        const category = await categoryService.getCategory(id.toString());

        // Assert
        expect(category).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(category.id)).toBe(true);
        expect(category).toHaveProperty('description');
        expect(category.description).toEqual(description);
    });

    it('Should not get category with invalid category id', async () => {
        // Arrange
        const id = new mongoose.Types.ObjectId();

        (categoryModel.findById as jest.Mock).mockResolvedValue(undefined);

        // Act & Assert
        await expect(categoryService.getCategory(id.toString()))
            .rejects.toThrow(AppError);
    });

});