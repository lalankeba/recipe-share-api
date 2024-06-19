"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gender_1 = __importDefault(require("../enums/gender"));
const role_1 = __importDefault(require("../enums/role"));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: Object.values(gender_1.default), required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: Object.values(role_1.default), default: [role_1.default.User] }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret.password;
            delete ret._id;
            return ret;
        }
    },
    versionKey: '__v'
});
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
