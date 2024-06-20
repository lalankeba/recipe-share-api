import express from 'express';
import { getSelf, getUser, getUsers, updateSelf, updateUser, getSelfRecipes, getRecipesByUser } from '../controllers/user-controller';
import checkRoles from '../middleware/check-roles';
import Role from '../enums/role';
import authenticateJwt from '../middleware/authenticate-jwt';

const userRoute = express.Router();

userRoute.get('/', authenticateJwt, checkRoles([Role.Admin]), getUsers);
userRoute.get('/user', authenticateJwt, checkRoles([Role.Admin, Role.User]), getSelf);
userRoute.get('/user/:id', authenticateJwt, checkRoles([Role.Admin]), getUser);
userRoute.put('/user', authenticateJwt, checkRoles([Role.Admin, Role.User]), updateSelf);
userRoute.put('/user/:id', authenticateJwt, checkRoles([Role.Admin]), updateUser);
userRoute.get('/recipes', authenticateJwt, checkRoles([Role.Admin, Role.User]), getSelfRecipes);
userRoute.get('/:id/recipes', authenticateJwt, checkRoles([Role.Admin]), getRecipesByUser);

export default userRoute;