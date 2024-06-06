import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import userModel from '../../src/models/user-model';
import * as authService from '../../src/services/auth-service';
import Gender from '../../src/enums/gender';
import Role from '../../src/enums/role';
import { DisplayableUser } from '../../src/interfaces/i-user';
import AppError from '../../src/errors/app-error';

jest.mock('../../src/models/user-model');

describe('auth', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('Should register a new user', async () => {
        // Arrange
        const id = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const email = "john@example.com";
        const password = "Abcd@1234";
        const roles = [Role.User];
        
        const userDoc = {
            _id: id,
            firstName,
            lastName,
            gender,
            email,
            password: await bcryptjs.hash(password, 10),
            roles,
            toJSON: function() {
                const { password, ...rest } = this;
                return rest;
            }
        };

        (userModel.create as jest.Mock).mockResolvedValue(userDoc);

        // Act
        const registeredUser: DisplayableUser = await authService.register(firstName, lastName, gender, email, password);

        // Assert
        expect(registeredUser).toEqual(expect.any(Object));
        expect(mongoose.Types.ObjectId.isValid(registeredUser._id)).toBe(true);
        expect(registeredUser).toHaveProperty('gender');
        expect(registeredUser.gender).toEqual(Gender.Male);
        expect(registeredUser).toHaveProperty('roles');
        expect(registeredUser.roles).toEqual([Role.User]);
        expect(registeredUser).not.toHaveProperty('password');
    });

    it('Should not register a new user with invalid password', async () => {
        // Arrange
        const firstName = 'Mary';
        const lastName = 'Anne';
        const gender = Gender.Female;
        const email = "mary@example.com";
        const password = "notagoodpassword";

        // Act & Assert
        await expect(authService.register(firstName, lastName, gender, email, password))
            .rejects.toThrow(AppError);
        await expect(authService.register(firstName, lastName, gender, email, password))
            .rejects.toThrow(
                expect.objectContaining({ message: expect.stringMatching(/^Invalid password./) })
            );
    });

    it('Should not register a new user with existing email', async () => {
        // Arrange
        const id = new mongoose.Types.ObjectId();
        const firstName = 'John';
        const lastName = 'Doe';
        const gender = Gender.Male;
        const email = "john@example.com";
        const password = "Abcd@1234";
        const roles = [Role.User];

        const userDoc = {
            _id: id,
            firstName,
            lastName,
            gender,
            email,
            password: await bcryptjs.hash(password, 10),
            roles,
            toJSON: function() {
                const { password, ...rest } = this;
                return rest;
            }
        };

        (userModel.findOne as jest.Mock).mockResolvedValue(userDoc);

        // Act & Assert
        await expect(authService.register(firstName, lastName, gender, email, password))
            .rejects.toThrow(AppError);
        await expect(authService.register(firstName, lastName, gender, email, password))
            .rejects.toThrow(
                expect.objectContaining({ message: expect.stringMatching(/^Existing user found for the email/) })
            );
    });

});