import { Schema, model, Document } from 'mongoose';
import IRecipe from '../interfaces/i-recipe';

interface RecipeDocument extends IRecipe, Document {}

const recipeTimesSchema = new Schema(
    {
        prepTime: { type: String, required: true },
        cookTime: { type: String, required: true },
        additionalTime: { type: String }
    },
    { _id: false }
);

const recipeCategorySchema = new Schema(
    {
        categoryId: { type: String, required: true, ref: 'Category' },
        description: { type: String, required: true }
    },
    { _id: false }
);

const recipeCommentSchema = new Schema(
    {
        commentId: { type: String, required: true, ref: 'Comment' },
        description: { type: String, required: true },
        createdAt: { type: String, required: true },
        userId: { type: String, required: true, ref: 'User' },
        userFullName: { type: String, required: true }
    },
    { _id: false }
);

const recipeUserSchema = new Schema(
    {
        userId: { type: String, required: true, ref: 'User' },
        userFullName: { type: String, required: true }
    },
    { _id: false }
);

const recipeSchema = new Schema<RecipeDocument>(
    {
        title: { type: String, required: true },
        subTitle: { type: String },
        picture: { type: String },
        instructions: { type: String, required: true },
        ingredients: { type: [String] },
        times: { type: recipeTimesSchema },
        categories: { type: [recipeCategorySchema], required: true },
        tags: { type: [String] },
        comments: { type: [recipeCommentSchema] },
        totalComments: { type: Number },
        user: { type: recipeUserSchema, required: true }
    },
    {
      timestamps: true,
      toJSON: {
        transform: (doc, { _id, ...rest }) => ({
          id: _id,
          ...rest
        })
      },
      versionKey: '__v'
    }
);

const recipeModel = model<RecipeDocument>('Recipe', recipeSchema);

export default recipeModel;
export { RecipeDocument };
