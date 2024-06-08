import express from 'express';
import { getUsers } from '../controllers/user-controller';
import passport from 'passport';
import checkRoles from '../middleware/check-roles';
import Role from '../enums/role';
import authenticateJwt from '../middleware/authenticate-jwt';

const userRoute = express.Router();

userRoute.get('/', authenticateJwt, checkRoles([Role.Admin]), getUsers);

export default userRoute;