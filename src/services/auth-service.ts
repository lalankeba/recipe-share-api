import logger from '../config/logger';
import validatePassword from '../config/validate-password';
import Gender from '../enums/gender';
import AppError from '../errors/app-error';
import { DisplayableUser } from '../interfaces/i-user';
import userModel, { UserDocument } from '../models/user-model';
import bcrypt from 'bcryptjs';
import jsonwebtoken, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { validateUserDetails } from '../validators/user-validator';
import IJwtPayload from '../interfaces/i-jwt-payload';

const register = async (firstName: string, lastName: string, gender: Gender, email: string, password: string): Promise<DisplayableUser> => {
    validateUserDetails(firstName, lastName, gender, email);

    const passwordValidationResult: boolean | any[] = validatePassword(password);
    if (Array.isArray(passwordValidationResult) && passwordValidationResult.length !== 0) { // not a valid password
        throw new AppError(`Invalid password. ${passwordValidationResult[0].message}`, 400);
    }

    const existingUser = await userModel.findOne({email: email});
    if (existingUser) {
        throw new AppError(`Existing user found for the email: ${email}`, 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDocument: UserDocument = await userModel.create({ 
        firstName: firstName.trim(), 
        lastName: lastName.trim(), 
        gender, 
        email: email.toLowerCase(), 
        password: hashedPassword
    });

    logger.info(`User created for ${firstName} ${lastName}`);
    
    return userDocument.toJSON();
}

const login = async (email: string, password: string): Promise<string> => {
    if (!email || !password) {
        throw new AppError('Credentials are required', 400);
    }

    const user = await userModel.findOne({ email: email });
    if (!user) { // no user found for the provided email
        throw new AppError('Credentials are invalid', 400);
    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) { // valid user
            const jwtPayload: IJwtPayload = {
                jwtid: uuidv4(), email: user.email, roles: user.roles
            };
            const JWT_SECRET = process.env.JWT_SECRET as string;
            const options: SignOptions = {
                algorithm: 'HS512', expiresIn: '1d'
            }
            const token = jsonwebtoken.sign( jwtPayload, JWT_SECRET, options );
            logger.info(`User logged in`);
            return token;
        } else { // password does not match
            throw new AppError('Credentials are invalid', 400);
        }
    }
}

export { register, login };