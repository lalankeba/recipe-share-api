import { Schema, model, Document } from 'mongoose';
import IComment from '../interfaces/i-comment';
import userModel from './user-model';
import AppError from '../errors/app-error';
import recipeModel from './recipe-model';

interface CommentDocument extends IComment, Document {}

const commentUserSchema = new Schema(
  {
      userId: { type: String, required: true, ref: 'User' },
      userFullName: { type: String, required: true }
  },
  { _id: false }
);

const commentSchema = new Schema<CommentDocument>(
    {
        description: { type: String, required: true },
        user: { type: commentUserSchema, required: true },
        recipeId: { type: String, required: true, ref: 'Recipe' },
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

commentSchema.pre('save', async function(next) {
  const comment = this as CommentDocument;

  // Validate userId
  const user = await userModel.findById(comment.user.userId);
  if (!user) {
      return next(new AppError(`User not found for userId: ${comment.user.userId}`, 400));
  }

  // Validate recipeId
  const recipe = await recipeModel.findById(comment.recipeId);
  if (!recipe) {
      return next(new AppError(`Recipe not found for recipeId: ${comment.recipeId}`, 400));
  }

  next();
});

const commentModel = model<CommentDocument>('Comment', commentSchema);

export default commentModel;
export { CommentDocument };
