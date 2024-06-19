import express from 'express';
import { createComment } from '../controllers/comment-controller';
import authenticateJwt from '../middleware/authenticate-jwt';
import checkRoles from '../middleware/check-roles';
import Role from '../enums/role';

const commentRoute = express.Router();

commentRoute.post('/', authenticateJwt, checkRoles([Role.Admin, Role.User]), createComment);

export default commentRoute;