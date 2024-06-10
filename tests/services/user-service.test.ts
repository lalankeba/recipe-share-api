import mongoose from 'mongoose';
import * as userService from '../../src/services/user-service';
import userModel from '../../src/models/user-model';
import AppError from '../../src/errors/app-error';
import Role from '../../src/enums/role';
import Gender from '../../src/enums/gender';

jest.mock('../../src/models/user-model');

describe('auth', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('Should get list of users', async () => {
        // Arrange
        const existingUsers = [
            { _id: new mongoose.Types.ObjectId(), firstName: 'John', lastName: 'Doe', gender: Gender.Male, email: 'john@example.com', roles: [Role.User, Role.Admin] },
            { _id: new mongoose.Types.ObjectId(), firstName: 'Lucy', lastName: 'Anne', gender: Gender.Female, email: 'lucy@example.com', roles: [Role.User] },
            { _id: new mongoose.Types.ObjectId(), firstName: 'Tom', lastName: 'Kenut', gender: Gender.Male, email: 'tom@example.com', roles: [Role.User] },
            { _id: new mongoose.Types.ObjectId(), firstName: 'Nate', lastName: 'Horton', gender: Gender.Custom, email: 'nate@example.com', roles: [Role.User, Role.Admin] },
            { _id: new mongoose.Types.ObjectId(), firstName: 'Jane', lastName: 'Mannz', gender: Gender.Female, email: 'jane@example.com', roles: [Role.User] }
        ];
        const findMock = jest.fn().mockReturnThis();
        const skipMock = jest.fn().mockReturnThis();
        const limitMock = (userModel.create as jest.Mock).mockResolvedValue(existingUsers);

        userModel.find = findMock;
        (userModel.find as jest.Mock).mockImplementation(() => ({
            skip: skipMock,
            limit: limitMock,
        }));

        // Act
        const users = await userService.getUsers(0, 5);

        // Assert
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(5);
        users.forEach((user) => {
            expect(user).toHaveProperty('_id');
            expect(user).toHaveProperty('firstName');
            expect(user).toHaveProperty('lastName');
            expect(user).toHaveProperty('gender');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('roles');
        });
    });

    const invalidGetParams: [number, number][] = [
        [-2, 5], // page is less than 0
        [1, 0], // size is less than 1
        [0, 0], // both page and size values are invalid
    ];
    test.each(invalidGetParams)('Should not get list of users for invalid parameters page:%s, size:%s', async (page , size) => {
        // Arrange
        (userModel.findOne as jest.Mock).mockResolvedValue(undefined);
    
        // Act & Assert
        await expect(userService.getUsers(page, size))
            .rejects.toThrow(AppError);
    });

    it('Should get logged in user', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const loggedInUser = { 
            _id: loggedInUserId, 
            firstName: 'Lucy', 
            lastName: 'Anne', 
            gender: Gender.Female, 
            email: 'lucy@example.com', 
            roles: [Role.User],
            toJSON: function() {
                const { password, ...rest } = this;
                rest.id = rest._id;
                delete rest._id;
                return rest;
            }
        };
        (userModel.findById as jest.Mock).mockResolvedValue(loggedInUser);

        // Act
        const user = await userService.getSelf(loggedInUserId.toString());

        // Assert
        expect(user).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(user.id)).toBe(true);
        expect(user).toHaveProperty('roles');
        expect(user.roles).toEqual([Role.User]);
        expect(user).not.toHaveProperty('password');
    });

    it('Should get any user', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const id = new mongoose.Types.ObjectId();
        const mockUser = { 
            _id: id, 
            firstName: 'Lucy', 
            lastName: 'Anne', 
            gender: Gender.Female, 
            email: 'lucy@example.com', 
            roles: [Role.User],
            toJSON: function() {
                const { password, ...rest } = this;
                rest.id = rest._id;
                delete rest._id;
                return rest;
            }
        };
        (userModel.findById as jest.Mock).mockResolvedValue(mockUser);

        // Act
        const user = await userService.getUser(loggedInUserId.toString(), id.toString());

        // Assert
        expect(user).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(user.id)).toBe(true);
        expect(user).toHaveProperty('roles');
        expect(user.roles).toEqual([Role.User]);
        expect(user).not.toHaveProperty('password');
    });

    it('Should not get user with same logged in user id', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const id = loggedInUserId;

        // Act & Assert
        await expect(userService.getUser(loggedInUserId.toString(), id.toString()))
            .rejects.toThrow(AppError);
    });

    it('Should not get user with invalid user id', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const id = new mongoose.Types.ObjectId();

        (userModel.findById as jest.Mock).mockResolvedValue(undefined);

        // Act & Assert
        await expect(userService.getUser(loggedInUserId.toString(), id.toString()))
            .rejects.toThrow(AppError);
    });

});