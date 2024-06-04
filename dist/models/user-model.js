"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gender_1 = __importDefault(require("../enums/gender"));
const role_1 = __importDefault(require("../enums/role"));
const UserModel = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: Object.values(gender_1.default), required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: Object.values(role_1.default), default: [role_1.default.User] }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('User', UserModel);
