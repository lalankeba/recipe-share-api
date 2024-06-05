import logger from '../config/logger';
import validatePassword from '../config/validate-password';
import Gender from '../enums/gender';
import AppError from '../errors/app-error';
import { DisplayableUser } from '../interfaces/i-user';
import userModel, { UserDocument } from '../models/user-model';
import bcrypt from 'bcryptjs';


const register = async (firstName: string, lastName: string, gender: Gender, email: string, password: string): Promise<DisplayableUser> => {
    const passwordValidationResult: boolean | any[] = validatePassword(password);
    if (Array.isArray(passwordValidationResult) && passwordValidationResult.length !== 0) { // not a valid password
        throw new AppError(`Invalid password. ${passwordValidationResult[0].message}`, 400);
    }

    const existingUser = await userModel.findOne({email: email});
    if (existingUser) {
        throw new AppError(`Existing user found for the email: ${email}`, 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDocument: UserDocument = await userModel.create({ firstName, lastName, gender, email, password: hashedPassword });

    logger.info(`User created for ${firstName} ${lastName}`);
    
    return { ...userDocument.toJSON() };
}

export { register };