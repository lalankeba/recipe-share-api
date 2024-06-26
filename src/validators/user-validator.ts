import Gender from "../enums/gender";
import Role from "../enums/role";
import AppError from "../errors/app-error"

const validateUserDetails = (firstName: string, lastName: string, gender: Gender, email: string): boolean => {
    validateFirstName(firstName);
    validateLastName(lastName);
    validateGender(gender);
    validateEmail(email);
    return true;
}

const validateFirstName = (firstName: string): boolean => {
    if (!firstName || firstName === null || firstName.trim() === "") {
        throw new AppError('First name required', 400);
    }
    const firstNameRegex = /^[a-zA-Z]+$/;
    if (!firstNameRegex.test(firstName)) {
        throw new AppError(`First name: ${firstName} is not valid`, 400);
    }
    return true;
}

const validateLastName = (lastName: string): boolean => {
    if (!lastName || lastName === null || lastName.trim() === "") {
        throw new AppError('Last name required. Should not have digits or special characters.', 400);
    }
    const lastNameRegex = /^[a-zA-Z]+$/;
    if (!lastNameRegex.test(lastName)) {
        throw new AppError(`Last name: ${lastName} is not valid. Should not have digits or special characters.`, 400);
    }
    return true;
}

const validateGender = (gender: Gender): boolean => {
    if (!gender || gender === null) {
        throw new AppError('Gender required', 400);
    } else if (!(Object.values(Gender).includes(gender))) {
        throw new AppError(`Gender: ${gender} is not valid. Valid values are ${Object.values(Gender)}`, 400);
    }
    return true;
}

const validateEmail = (email: string): boolean => {
    if (!email || email === null || email.trim() === "") {
        throw new AppError('Email required', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new AppError(`Email: ${email} is not valid`, 400);
    }
    return true;
}

const validateRoles = (roles: Role[]): boolean => {
    if (!roles || roles === null) {
        throw new AppError('Roles required', 400);
    }
    return true;
}

export { validateUserDetails, validateFirstName, validateLastName, validateGender, validateEmail, validateRoles }