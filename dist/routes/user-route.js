"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user-controller");
const check_roles_1 = __importDefault(require("../middleware/check-roles"));
const role_1 = __importDefault(require("../enums/role"));
const authenticate_jwt_1 = __importDefault(require("../middleware/authenticate-jwt"));
const userRoute = express_1.default.Router();
userRoute.get('/', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin]), user_controller_1.getUsers);
userRoute.get('/user', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin, role_1.default.User]), user_controller_1.getSelf);
userRoute.get('/user/:id', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin]), user_controller_1.getUser);
exports.default = userRoute;
