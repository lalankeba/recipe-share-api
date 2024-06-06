"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const validate_password_1 = __importDefault(require("../config/validate-password"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const user_model_1 = __importDefault(require("../models/user-model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const register = async (firstName, lastName, gender, email, password) => {
    const passwordValidationResult = (0, validate_password_1.default)(password);
    if (Array.isArray(passwordValidationResult) && passwordValidationResult.length !== 0) { // not a valid password
        throw new app_error_1.default(`Invalid password. ${passwordValidationResult[0].message}`, 400);
    }
    const existingUser = await user_model_1.default.findOne({ email: email });
    if (existingUser) {
        throw new app_error_1.default(`Existing user found for the email: ${email}`, 400);
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const userDocument = await user_model_1.default.create({ firstName, lastName, gender, email, password: hashedPassword });
    logger_1.default.info(`User created for ${firstName} ${lastName}`);
    return { ...userDocument.toJSON() };
};
exports.register = register;
const login = async (email, password) => {
    if (!email || !password) {
        throw new app_error_1.default('Credentials are required', 400);
    }
    const user = await user_model_1.default.findOne({ email: email });
    if (!user) { // no user found for the provided email
        throw new app_error_1.default('Credentials are invalid', 400);
    }
    else {
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (isMatch) { // valid user
            const JWT_SECRET = process.env.JWT_SECRET;
            const token = jsonwebtoken_1.default.sign({ jwtid: (0, uuid_1.v4)(), email: user.email, roles: user.roles }, JWT_SECRET, { algorithm: 'HS512', expiresIn: '1d' });
            logger_1.default.info(`User logged in`);
            return token;
        }
        else { // password does not match
            throw new app_error_1.default('Credentials are invalid', 400);
        }
    }
};
exports.login = login;
