"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category-controller");
const authenticate_jwt_1 = __importDefault(require("../middleware/authenticate-jwt"));
const check_roles_1 = __importDefault(require("../middleware/check-roles"));
const role_1 = __importDefault(require("../enums/role"));
const categoryRoute = express_1.default.Router();
categoryRoute.post('/', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin]), category_controller_1.createCategory);
categoryRoute.get('/', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin, role_1.default.User]), category_controller_1.getCategories);
categoryRoute.get('/:id', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin, role_1.default.User]), category_controller_1.getCategory);
categoryRoute.put('/:id', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin]), category_controller_1.updateCategory);
exports.default = categoryRoute;
