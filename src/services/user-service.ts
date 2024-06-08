import AppError from "../errors/app-error";
import userModel from "../models/user-model";

const getUsers = async (page: number, size: number) => {
    if (page < 0) {
        throw new AppError(`The page: ${page} parameter must be 0 or a positive integer`, 400);
    } else if (size < 1) {
        throw new AppError(`The size: ${size} parameter must be a positive integer`, 400);
    }
    const users = await userModel
        .find({}, { firstName: 1, lastName: 1, gender: 1, email: 1, roles: 1 })
        .skip(page * size)
        .limit(size);
    return users;
}

export { getUsers };