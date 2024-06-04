"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_validator_1 = __importDefault(require("password-validator"));
const schema = new password_validator_1.default();
schema
    .is().min(8) // Minimum length 8
    .is().max(50) // Maximum length 50
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(1) // Must have at least 1 digit
    .has().not().spaces() // Should not have spaces
    .has().symbols() // Must have special characters
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
const validatePassword = (password) => {
    return schema.validate(password, { details: true });
};
exports.default = validatePassword;
