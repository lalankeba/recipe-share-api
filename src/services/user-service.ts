import AppError from "../errors/app-error";
import { DisplayableUser } from "../interfaces/i-user";
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

    return users.map(user => user.toJSON());
}

const getSelf = async (loggedInUserId: string): Promise<DisplayableUser> => {
    return getAnyUser(loggedInUserId);
}

const getUser = async (loggedInUserId: string, userId: string): Promise<DisplayableUser> => {
    if (loggedInUserId === userId) {
        throw new AppError(`Access denied. Use self API to get yourself`, 400);
    }
    return getAnyUser(userId);
}

const getAnyUser = async (userId: string): Promise<DisplayableUser> => {
    const user = await userModel.findById(userId, { firstName: 1, lastName: 1, gender: 1, email: 1, roles: 1, createdAt: 1, updatedAt: 1 });
    if (user) {
        return user.toJSON();
    } else {
        throw new AppError(`User cannot be found for id: ${userId}`, 400);
    }
}

export { getUsers, getSelf, getUser };