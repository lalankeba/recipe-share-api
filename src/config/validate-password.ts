import passwordValidator from 'password-validator';

const schema = new passwordValidator();

schema
    .is().min(8) // Minimum length 8
    .is().max(50) // Maximum length 50
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(1) // Must have at least 1 digit
    .has().not().spaces() // Should not have spaces
    .has().symbols() // Must have special characters
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

const validatePassword = (password: string): boolean | any[] => {
    return schema.validate(password, { details: true });
}

export default validatePassword;