import mongoose from "mongoose";
import commentModel, { CommentDocument } from '../../src/models/comment-model';
import { DisplayableComment } from "../../src/interfaces/i-comment";
import * as commentService from '../../src/services/comment-service';
import AppError from "../../src/errors/app-error";
import userModel, { UserDocument } from "../../src/models/user-model";
import categoryModel from "../../src/models/category-model";
import recipeModel from "../../src/models/recipe-model";
import Role from "../../src/enums/role";

jest.mock('../../src/models/recipe-model');
jest.mock('../../src/models/user-model');
jest.mock('../../src/models/category-model');
jest.mock('../../src/models/comment-model');

describe('comment', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    const toJSON = function(this: CommentDocument) {
        const { _id, ...rest } = this;
        return { ...rest, id: _id };
    };

    const toJSONForUser = function(this: UserDocument) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, _id, ...rest } = this;
        return { ...rest, id: _id };
    };

    it('Should create a new comment', async () => {
        // Arrange
        const userDoc = getTestUserDoc();
        const categoryDoc = getTestCategoryDoc();

        const categoryIds = [categoryDoc._id.toString()];
        const recipeUserId = new mongoose.Types.ObjectId().toString();
        const recipeDoc = getTestRecipeDoc(categoryIds, recipeUserId);
        const recipeId = recipeDoc._id.toString();

        const userId = userDoc._id.toString();
        const description = 'Thanks for sharing a nice recipe. Keep it up.';
        const commentDoc = getTestCommentDoc(description, userId, recipeId);

        const updatedRecipeDoc = { ...recipeDoc };
        const commentId = commentDoc._id.toString();
        updatedRecipeDoc.comments = [{ commentId: commentId, description, userId }];
        updatedRecipeDoc.totalComments = updatedRecipeDoc.totalComments + 1;

        const execMock = (categoryModel.create as jest.Mock).mockResolvedValue([categoryDoc]);
        (categoryModel.find as jest.Mock).mockImplementation(() => ({ exec: execMock }));
        (userModel.findById as jest.Mock).mockResolvedValue(userDoc);
        (recipeModel.findById as jest.Mock).mockResolvedValue(recipeDoc);
        (recipeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedRecipeDoc);
        (commentModel.create as jest.Mock).mockResolvedValue(commentDoc);

        // Act
        const createdComment: DisplayableComment = await commentService.createComment(userId, recipeId, description);

        // Assert
        expect(createdComment).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(createdComment.id)).toBe(true);
        expect(createdComment).toHaveProperty('description');
        expect(createdComment.description).toEqual(description);
        expect(createdComment).toHaveProperty('recipeId');
        expect(createdComment.recipeId).toEqual(recipeId);
        expect(createdComment).toHaveProperty('user');
    });

    const invalidDecriptions: [string][] = [
        [''], // comment description is empty
        ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie, nisl vitae porta molestie, dolor ante ultrices justo, non feugiat orci urna sed risus. Sed pretium odio et mauris rutrum, ut condimentum justo ullamcorper. Nulla auctor urna id enim consequat, eget vulputate orci hendrerit. Proin et augue pellentesque, ornare odio nec, lacinia enim. Donec ex turpis, dapibus et elit sed, pellentesque commodo purus. Aliquam sed luctus dolor, eu consectetur mauris. Nullam vitae mattis nulla. Etiam venenatis eleifend massa sed fermentum. Etiam vehicula eros eu urna lobortis tempus. Vivamus blandit porttitor turpis at mollis.'], // comment description is too long
    ];
    test.each(invalidDecriptions)('Should not create a new comment with invalid description:%s', async (description) => {
        // Arrange
        const userId = new mongoose.Types.ObjectId().toString();
        const recipeId = new mongoose.Types.ObjectId().toString();
    
        // Act & Assert
        await expect(commentService.createComment(userId, recipeId, description))
            .rejects.toThrow(AppError);
    });

    it('Should not create a new comment for invalid user', async () => {
        // Arrange
        const userId = new mongoose.Types.ObjectId().toString();
        const recipeId = new mongoose.Types.ObjectId().toString();
        const description = 'Yummy recipe. Thanks';

        (userModel.findById as jest.Mock).mockResolvedValue(undefined);
    
        // Act & Assert
        await expect(commentService.createComment(userId, recipeId, description))
            .rejects.toThrow(AppError);
    });

    it('Should not create a new comment for invalid recipe', async () => {
        // Arrange
        const userDoc = getTestUserDoc();
        const userId = userDoc._id.toString();
        const recipeId = new mongoose.Types.ObjectId().toString();
        const description = 'Yummy recipe. Thanks';

        (userModel.findById as jest.Mock).mockResolvedValue(userDoc);
        (recipeModel.findById as jest.Mock).mockResolvedValue(undefined);
    
        // Act & Assert
        await expect(commentService.createComment(userId, recipeId, description))
            .rejects.toThrow(AppError);
    });

    it('Should get list of comments', async () => {
        // Arrange
        const commentDocs = [
            getTestCommentDoc('Nice one', new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString()),
            getTestCommentDoc('Great article', new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString()),
            getTestCommentDoc('Thanks for sharing', new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString()),
            getTestCommentDoc('Wonderful. Thanks', new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString()),
            getTestCommentDoc('Thanks for the yummy recipe', new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString())
        ];

        const findMock = jest.fn().mockReturnThis();
        const skipMock = jest.fn().mockReturnThis();
        const limitMock = (commentModel.create as jest.Mock).mockResolvedValue(commentDocs);
        commentModel.find = findMock;
        (commentModel.find as jest.Mock).mockImplementation(() => ({
            skip: skipMock,
            limit: limitMock,
        }));

        // Act
        const comments = await commentService.getComments(0, commentDocs.length);

        // Assert
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(commentDocs.length);
        commentDocs.forEach((comment) => {
            expect(comment).toHaveProperty('description');
        });
    });

    it('Should get list of comments by recipe', async () => {
        // Arrange
        const categoryDoc = getTestCategoryDoc();
        const categoryIds = [categoryDoc._id.toString()];
        const recipeUserId = new mongoose.Types.ObjectId().toString();
        const recipeDoc = getTestRecipeDoc(categoryIds, recipeUserId);

        const recipeId = recipeDoc._id.toString();
        const commentDocs = [
            getTestCommentDoc('Nice one', new mongoose.Types.ObjectId().toString(), recipeId),
            getTestCommentDoc('Thanks for the yummy recipe', new mongoose.Types.ObjectId().toString(), recipeId),
            getTestCommentDoc('Wonderful. Thanks', new mongoose.Types.ObjectId().toString(), recipeId),
            getTestCommentDoc('Great article', new mongoose.Types.ObjectId().toString(), recipeId),
            getTestCommentDoc('Thanks for sharing', new mongoose.Types.ObjectId().toString(), recipeId)
        ];

        (recipeModel.findById as jest.Mock).mockResolvedValue(recipeDoc);
        const findMock = jest.fn().mockReturnThis();
        const skipMock = jest.fn().mockReturnThis();
        const limitMock = (commentModel.create as jest.Mock).mockResolvedValue(commentDocs);
        commentModel.find = findMock;
        (commentModel.find as jest.Mock).mockImplementation(() => ({
            skip: skipMock,
            limit: limitMock,
        }));

        // Act
        const comments = await commentService.getCommentsByRecipe(recipeId, 0, commentDocs.length);

        // Assert
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(commentDocs.length);
        commentDocs.forEach((comment) => {
            expect(comment).toHaveProperty('description');
        });
    });

    it('Should not get comments for invalid recipe', async () => {
        // Arrange
        const recipeId = new mongoose.Types.ObjectId().toString();

        (recipeModel.findById as jest.Mock).mockResolvedValue(undefined);
    
        // Act & Assert
        await expect(commentService.getCommentsByRecipe(recipeId, 0, 5))
            .rejects.toThrow(AppError);
    });

    it('Should get a comment by id', async () => {
        // Arrange
        const commentId = new mongoose.Types.ObjectId().toString();
        const description = 'Nice one';
        const commentDoc = getTestCommentDoc(description, new mongoose.Types.ObjectId().toString(), commentId);

        (commentModel.findById as jest.Mock).mockResolvedValue(commentDoc);

        // Act
        const comment = await commentService.getComment(commentId);

        // Assert
        expect(comment).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(comment.id)).toBe(true);
        expect(comment).toHaveProperty('description');
        expect(comment.description).toEqual(description);
    });

    it('Should not get a comment by invalid id', async () => {
        // Arrange
        const commentId = new mongoose.Types.ObjectId().toString();

        (commentModel.findById as jest.Mock).mockResolvedValue(undefined);
    
        // Act & Assert
        await expect(commentService.getComment(commentId))
            .rejects.toThrow(AppError);
    });

    const getTestCommentDoc = (description: string, userId: string, recipeId: string) => {
        const id = new mongoose.Types.ObjectId();
        
        const commentDoc = {
            _id: id,
            description,
            user: { userId, userFullName: 'Cris Haris' },
            recipeId,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON
        };

        return commentDoc;
    }

    const getTestRecipeDoc = (categoryIds: string[], userId: string) => {
        const title = 'Chicken curry';
        const instructions = 'Season the chicken pieces with a pinch of salt and pepper. Heat oil in a large pan or pot over medium heat. Add cumin seeds and let them sizzle for a few seconds.';
        const recipeId = new mongoose.Types.ObjectId();
        const subTitle = 'Asian chicken curry';
        const picture = 'chicken-curry.jpg';
        const ingredients = ['1 lb (450 g) chicken', '2 tablespoons oil', '1 large onion, finely chopped', '3 cloves garlic, minced'];
        const prepTime = '15 mins';
        const cookTime = '30 mins';
        const additionalTime = '5 mins';
        const tags = ['chicken', 'curry', 'spicy'];
        const comments: object[] = [];
        const totalComments = 0;
        
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
            comments,
            totalComments,
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