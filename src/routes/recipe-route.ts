import express from 'express';
import { createRecipe, getRecipes, getRecipe } from '../controllers/recipe-controller';
import authenticateJwt from '../middleware/authenticate-jwt';
import checkRoles from '../middleware/check-roles';
import Role from '../enums/role';

const recipeRoute = express.Router();

recipeRoute.post('/', authenticateJwt, checkRoles([Role.Admin, Role.User]), createRecipe);
recipeRoute.get('/', getRecipes);
recipeRoute.get('/:id', getRecipe);

export default recipeRoute;