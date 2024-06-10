import express from 'express';
import { getSelf, getUser, getUsers } from '../controllers/user-controller';
import checkRoles from '../middleware/check-roles';
import Role from '../enums/role';
import authenticateJwt from '../middleware/authenticate-jwt';

const userRoute = express.Router();

userRoute.get('/', authenticateJwt, checkRoles([Role.Admin]), getUsers);
userRoute.get('/user', authenticateJwt, checkRoles([Role.Admin, Role.User]), getSelf);
userRoute.get('/user/:id', authenticateJwt, checkRoles([Role.Admin]), getUser);

export default userRoute;