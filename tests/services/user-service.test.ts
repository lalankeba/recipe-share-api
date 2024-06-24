import mongoose from 'mongoose';
import * as userService from '../../src/services/user-service';
import userModel, { UserDocument } from '../../src/models/user-model';
import AppError from '../../src/errors/app-error';
import Role from '../../src/enums/role';
import Gender from '../../src/enums/gender';
import { DisplayableUser } from '../../src/interfaces/i-user';

jest.mock('../../src/models/user-model');

describe('user', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    const toJSON = function(this: UserDocument) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, _id, ...rest } = this;
        return { ...rest, id: _id };
    };

    it('Should get list of users', async () => {
        // Arrange
        const existingUsers = [
            { _id: new mongoose.Types.ObjectId(), firstName: 'John', lastName: 'Doe', gender: Gender.Male, email: 'john@example.com', roles: [Role.User, Role.Admin], toJSON },
            { _id: new mongoose.Types.ObjectId(), firstName: 'Lucy', lastName: 'Anne', gender: Gender.Female, email: 'lucy@example.com', roles: [Role.User], toJSON },
            { _id: new mongoose.Types.ObjectId(), firstName: 'Tom', lastName: 'Kenut', gender: Gender.Male, email: 'tom@example.com', roles: [Role.User], toJSON },
            { _id: new mongoose.Types.ObjectId(), firstName: 'Nate', lastName: 'Horton', gender: Gender.Custom, email: 'nate@example.com', roles: [Role.User, Role.Admin], toJSON },
            { _id: new mongoose.Types.ObjectId(), firstName: 'Jane', lastName: 'Mannz', gender: Gender.Female, email: 'jane@example.com', roles: [Role.User], toJSON }
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
            expect(user).toHaveProperty('id');
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
            toJSON
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
            toJSON
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

    it('Should update logged in user', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const version = 0;
        const email = 'lisa@example.com';
        const roles = [Role.User];

        const loggedInUser = { 
            _id: loggedInUserId, 
            firstName: 'Lisa', 
            lastName: 'Mary', 
            gender: Gender.Female, 
            email, 
            roles,
            __v: version,
            toJSON
        };

        const updatedUserMock = { 
            _id: loggedInUserId, 
            firstName, 
            lastName, 
            gender, 
            email, 
            roles,
            __v: version + 1,
            toJSON
        };
        (userModel.findById as jest.Mock).mockResolvedValue(loggedInUser);
        (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUserMock);

        // Act
        const updatedUser: DisplayableUser = await userService.updateSelf(loggedInUserId.toString(), firstName, lastName, gender, version);

        // Assert
        expect(updatedUser).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(updatedUser.id)).toBe(true);
        expect(updatedUser).toHaveProperty('gender');
        expect(updatedUser.gender).toEqual(gender);
        expect(updatedUser).toHaveProperty('email');
        expect(updatedUser.email).toEqual(email);
        expect(updatedUser).toHaveProperty('roles');
        expect(updatedUser.roles).toEqual(roles);
        expect(updatedUser).toHaveProperty('__v');
        expect(updatedUser.__v).toEqual(version + 1);
        expect(updatedUser).not.toHaveProperty('password');
    });

    it('Should not update an invalid logged in user', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const version = 0;

        (userModel.findById as jest.Mock).mockResolvedValue(undefined);

        // Act & Assert
        await expect(userService.updateSelf(loggedInUserId.toString(), firstName, lastName, gender, version))
            .rejects.toThrow(AppError);
        await expect(userService.updateSelf(loggedInUserId.toString(), firstName, lastName, gender, version))
            .rejects.toThrow(
                expect.objectContaining({ statusCode: 400 })
            );
    });

    it('Should not update a logged in user with invalid version', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const version = 0;

        const existingUserMock = { 
            _id: loggedInUserId, 
            firstName: 'Lisa', 
            lastName, 
            gender, 
            email: 'john@example.com', 
            roles: [Role.User],
            __v: version + 1,
            toJSON
        };
        
        (userModel.findById as jest.Mock).mockResolvedValue(existingUserMock);

        // Act & Assert
        await expect(userService.updateSelf(loggedInUserId.toString(), firstName, lastName, gender, version))
            .rejects.toThrow(AppError);
        await expect(userService.updateSelf(loggedInUserId.toString(), firstName, lastName, gender, version))
            .rejects.toThrow(
                expect.objectContaining({ statusCode: 409 })
            );
    });

    it('Should not update a logged in user when database error occurs', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const version = 0;

        const existingUserMock = { 
            _id: loggedInUserId, 
            firstName: 'Lisa', 
            lastName, 
            gender, 
            email: 'john@example.com', 
            roles: [Role.User],
            __v: version,
            toJSON
        };
        
        (userModel.findById as jest.Mock).mockResolvedValue(existingUserMock);
        (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);

        // Act & Assert
        await expect(userService.updateSelf(loggedInUserId.toString(), firstName, lastName, gender, version))
            .rejects.toThrow(AppError);
        await expect(userService.updateSelf(loggedInUserId.toString(), firstName, lastName, gender, version))
            .rejects.toThrow(
                expect.objectContaining({ statusCode: 500 })
            );
    });

    const invalidSelfUserDetails: [string, string, Gender, number | undefined][] = [
        ['', 'Doe', Gender.Male, 0], // no first fname
        ['J0hn', 'Doe', Gender.Male, 0], // digit at first name
        ['Joh#', 'Doe', Gender.Male, 0], // symbol at first name
        ['John', '', Gender.Male, 0], // no last name
        ['John', 'D0e', Gender.Male, 0], // digit at last name
        ['John', 'Do3', Gender.Male, 0], // symbol at last name
        ['John', 'Doe', 'Male' as Gender, 0], // invalid word male
        ['John', 'Doe', 'invalidGender' as Gender, 0], // invalid gender
        ['John', 'Doe', Gender.Male, undefined], // invalid version
    ];
    test.each(invalidSelfUserDetails)('Should not update a user with invalid details firstName:%s, lastName:%s, gender:%s, version: %s', async (firstName, lastName, gender, version) => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
    
        // Act & Assert
        await expect(userService.updateSelf(loggedInUserId.toString(), firstName, lastName, gender, version as number))
            .rejects.toThrow(AppError);
    });

    it('Should update user', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const version = 0;
        const email = 'lisa@example.com';
        const roles = [Role.User];

        const preUpdatedUserMock = { 
            _id: userId, 
            firstName: 'Lisa', 
            lastName: 'Mary', 
            gender: Gender.Female, 
            email, 
            roles,
            __v: version,
            toJSON
        };

        const updatedUserMock = { 
            _id: userId, 
            firstName, 
            lastName, 
            gender, 
            email, 
            roles,
            __v: version + 1,
            toJSON
        };
        (userModel.findById as jest.Mock).mockResolvedValue(preUpdatedUserMock);
        (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUserMock);

        // Act
        const updatedUser: DisplayableUser = await userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles, version);

        // Assert
        expect(updatedUser).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(updatedUser.id)).toBe(true);
        expect(updatedUser).toHaveProperty('gender');
        expect(updatedUser.gender).toEqual(gender);
        expect(updatedUser).toHaveProperty('email');
        expect(updatedUser.email).toEqual(email);
        expect(updatedUser).toHaveProperty('roles');
        expect(updatedUser.roles).toEqual(roles);
        expect(updatedUser).toHaveProperty('__v');
        expect(updatedUser.__v).toEqual(version + 1);
        expect(updatedUser).not.toHaveProperty('password');
    });

    it('Should not update a logged in user with update user API', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const userId = loggedInUserId;
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const roles = [Role.User];
        const version = 0;

        // Act & Assert
        await expect(userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles, version))
            .rejects.toThrow(AppError);
        await expect(userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles, version))
            .rejects.toThrow(
                expect.objectContaining({ statusCode: 401 })
            );
    });

    it('Should not update a user with invalid id', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const roles = [Role.User];
        const version = 0;

        (userModel.findById as jest.Mock).mockResolvedValue(undefined);

        // Act & Assert
        await expect(userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles, version))
            .rejects.toThrow(AppError);
        await expect(userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles, version))
            .rejects.toThrow(
                expect.objectContaining({ statusCode: 400 })
            );
    });

    it('Should not update a user with invalid version', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const roles = [Role.User];
        const version = 0;

        const existingUserMock = { 
            _id: loggedInUserId, 
            firstName: 'Lisa', 
            lastName, 
            gender, 
            email: 'john@example.com', 
            roles: [Role.User],
            __v: version + 1,
            toJSON
        };

        (userModel.findById as jest.Mock).mockResolvedValue(existingUserMock);

        // Act & Assert
        await expect(userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles, version))
            .rejects.toThrow(AppError);
        await expect(userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles, version))
            .rejects.toThrow(
                expect.objectContaining({ statusCode: 409 })
            );
    });

    it('Should not update a user when database error occurs', async () => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const roles = [Role.User];
        const version = 0;

        const existingUserMock = { 
            _id: loggedInUserId, 
            firstName: 'Lisa', 
            lastName, 
            gender, 
            email: 'john@example.com', 
            roles: [Role.User],
            __v: version,
            toJSON
        };

        (userModel.findById as jest.Mock).mockResolvedValue(existingUserMock);
        (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);

        // Act & Assert
        await expect(userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles, version))
            .rejects.toThrow(AppError);
        await expect(userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles, version))
            .rejects.toThrow(
                expect.objectContaining({ statusCode: 500 })
            );
    });

    const invalidUserDetails: [string, string, Gender, Role[] | undefined, number | undefined][] = [
        ['', 'Doe', Gender.Male, [Role.User], 0], // no first fname
        ['J0hn', 'Doe', Gender.Male, [Role.User], 0], // digit at first name
        ['Joh#', 'Doe', Gender.Male, [Role.User], 0], // symbol at first name
        ['John', '', Gender.Male, [Role.User], 0], // no last name
        ['John', 'D0e', Gender.Male, [Role.User], 0], // digit at last name
        ['John', 'Do3', Gender.Male, [Role.User], 0], // symbol at last name
        ['John', 'Doe', 'Male' as Gender, [Role.User], 0], // invalid word male
        ['John', 'Doe', 'invalidGender' as Gender, [Role.User], 0], // invalid gender
        ['John', 'Doe', Gender.Male, undefined, 0], // invalid roles
        ['John', 'Doe', Gender.Male, [Role.User], undefined], // invalid version
    ];
    test.each(invalidUserDetails)('Should not update a user with invalid details firstName:%s, lastName:%s, gender:%s, roles: %s, version: %s', async (firstName, lastName, gender, roles, version) => {
        // Arrange
        const loggedInUserId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
    
        // Act & Assert
        await expect(userService.updateUser(loggedInUserId.toString(), userId.toString(), firstName, lastName, gender, roles as Role[], version as number))
            .rejects.toThrow(AppError);
    });

});