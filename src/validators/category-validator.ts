import AppError from "../errors/app-error";

const validateCategoryDescription = (description: string): boolean => {
    if (!description || description === null || description.trim() === "") {
        throw new AppError('Description required', 400);
    }
    return true;
}

export { validateCategoryDescription };