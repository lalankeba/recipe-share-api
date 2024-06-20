"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipe_controller_1 = require("../controllers/recipe-controller");
const authenticate_jwt_1 = __importDefault(require("../middleware/authenticate-jwt"));
const check_roles_1 = __importDefault(require("../middleware/check-roles"));
const role_1 = __importDefault(require("../enums/role"));
const recipeRoute = express_1.default.Router();
recipeRoute.post('/', authenticate_jwt_1.default, (0, check_roles_1.default)([role_1.default.Admin, role_1.default.User]), recipe_controller_1.createRecipe);
recipeRoute.get('/', recipe_controller_1.getRecipes);
recipeRoute.get('/:id', recipe_controller_1.getRecipe);
exports.default = recipeRoute;
