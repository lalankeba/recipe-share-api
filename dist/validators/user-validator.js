"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validateGender = exports.validateLastName = exports.validateFirstName = exports.validateUserDetails = void 0;
const gender_1 = __importDefault(require("../enums/gender"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const validateUserDetails = (firstName, lastName, gender, email) => {
    validateFirstName(firstName);
    validateLastName(lastName);
    validateGender(gender);
    validateEmail(email);
    return true;
};
exports.validateUserDetails = validateUserDetails;
const validateFirstName = (firstName) => {
    if (!firstName || firstName === null || firstName.trim() === "") {
        throw new app_error_1.default('First name required', 400);
    }
    const firstNameRegex = /^[a-zA-Z]+$/;
    if (!firstNameRegex.test(firstName)) {
        throw new app_error_1.default(`First name: ${firstName} is not valid`, 400);
    }
    return true;
};
exports.validateFirstName = validateFirstName;
const validateLastName = (lastName) => {
    if (!lastName || lastName === null || lastName.trim() === "") {
        throw new app_error_1.default('Last name required. Should not have digits or special characters.', 400);
    }
    const lastNameRegex = /^[a-zA-Z]+$/;
    if (!lastNameRegex.test(lastName)) {
        throw new app_error_1.default(`Last name: ${lastName} is not valid. Should not have digits or special characters.`, 400);
    }
    return true;
};
exports.validateLastName = validateLastName;
const validateGender = (gender) => {
    if (!gender || gender === null) {
        throw new app_error_1.default('Gender required', 400);
    }
    else if (!(Object.values(gender_1.default).includes(gender))) {
        throw new app_error_1.default(`Gender: ${gender} is not valid. Valid values are ${Object.values(gender_1.default)}`, 400);
    }
    return true;
};
exports.validateGender = validateGender;
const validateEmail = (email) => {
    if (!email || email === null || email.trim() === "") {
        throw new app_error_1.default('Email required', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new app_error_1.default(`Email: ${email} is not valid`, 400);
    }
    return true;
};
exports.validateEmail = validateEmail;
