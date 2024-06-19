import { Schema, model, Document } from 'mongoose';
import ICategory from '../interfaces/i-category';

interface CategoryDocument extends ICategory, Document {}

const categorySchema = new Schema<CategoryDocument>(
    {
        description: { type: String, required: true }
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

const categoryModel = model<CategoryDocument>('Category', categorySchema);

export default categoryModel;
export { CategoryDocument };
