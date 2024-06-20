"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment-controller");
const authenticate_jwt_1 = __importDefault(require("../middleware/authenticate-jwt"));
const check_roles_1 = __importDefault(require("../middleware/check-roles"));
const role_1 = __importDefault(require("../enums/role"));
const commentRoute = express_1.default.Router();
commentRoute.post('/', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin, role_1.default.User]), comment_controller_1.createComment);
commentRoute.get('/', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin]), comment_controller_1.getComments);
commentRoute.get('/:id', comment_controller_1.getComment);
exports.default = commentRoute;
