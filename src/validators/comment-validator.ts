import AppError from "../errors/app-error";

const validateCommentDescription = (description: string): boolean => {
    if (!description || description === null || description.trim().length < 2) {
        throw new AppError('Comment description required', 400);
    }
    if (description.length > 500) {
        throw new AppError('Comment is too long', 400);
    }
    return true;
}

export { validateCommentDescription };