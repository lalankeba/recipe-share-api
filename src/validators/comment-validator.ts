import AppError from "../errors/app-error";

const validateCommentDescription = (title: string): boolean => {
    if (!title || title === null || title.trim().length < 2) {
        throw new AppError('Comment description required', 400);
    }
    return true;
}

export { validateCommentDescription };