"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const validate_password_1 = __importDefault(require("../config/validate-password"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const user_model_1 = __importDefault(require("../models/user-model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
    const user = await user_model_1.default.create({ firstName, lastName, gender, email, password: hashedPassword });
    const employeeObj = user.toObject();
    return employeeObj;
};
exports.register = register;
