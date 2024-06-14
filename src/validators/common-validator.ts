import AppError from "../errors/app-error";

const validatePaginationDetails = (page: number, size: number): boolean => {
    validatePage(page);
    validateSize(size);
    return true;
}

const validatePage = (page: number): boolean => {
    if (page < 0) {
        throw new AppError(`The page: ${page} parameter must be 0 or a positive integer`, 400);
    }
    return true;
}

const validateSize = (size: number): boolean => {
    if (size < 1) {
        throw new AppError(`The size: ${size} parameter must be a positive integer`, 400);
    }
    return true;
}

const validateVersion = (__v: number): boolean => {
    if (__v === null || __v === undefined) {
        throw new AppError('Version required', 400);
    }
    return true
}

export { validatePaginationDetails, validateVersion };