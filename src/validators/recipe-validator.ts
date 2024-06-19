import AppError from "../errors/app-error";

const validateCreateRecipeDetails = (title: string, instructions: string): boolean => {
    validateRecipeTitle(title);
    validateRecipeInstructions(instructions);
    return true;
}

const validateRecipeTitle = (title: string): boolean => {
    if (!title || title === null || title.trim() === "") {
        throw new AppError('Title required', 400);
    }
    return true;
}

const validateRecipeInstructions = (instructions: string): boolean => {
    if (!instructions || instructions === null || instructions.trim() === "") {
        throw new AppError('Instructions required', 400);
    }
    return true;
}

export { validateCreateRecipeDetails, validateRecipeTitle, validateRecipeInstructions };