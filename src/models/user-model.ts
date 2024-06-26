import { Schema, model, Document } from 'mongoose';
import IUser from '../interfaces/i-user';
import Gender from '../enums/gender';
import Role from '../enums/role';

interface UserDocument extends IUser, Document {}

const userSchema = new Schema<UserDocument>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, enum: Object.values(Gender), required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        roles: { type: [String], enum: Object.values(Role), default: [Role.User] }
    },
    {
      timestamps: true,
      toJSON: {
        transform: (doc, ret) => {
          ret.id = ret._id;
          delete ret.password;
          delete ret._id;
          return ret;
        }
      },
      versionKey: '__v'
    }
);

const userModel = model<UserDocument>('User', userSchema);

export default userModel;
export { UserDocument };
