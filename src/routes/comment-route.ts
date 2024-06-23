import express from 'express';
import { createComment, getComment, getComments, updateComment } from '../controllers/comment-controller';
import authenticateJwt from '../middleware/authenticate-jwt';
import checkRoles from '../middleware/check-roles';
import Role from '../enums/role';

const commentRoute = express.Router();

commentRoute.post('/', authenticateJwt, checkRoles([Role.Admin, Role.User]), createComment);
commentRoute.get('/', authenticateJwt, checkRoles([Role.Admin]), getComments);
commentRoute.get('/:id', getComment);
commentRoute.put('/:id', authenticateJwt, checkRoles([Role.Admin, Role.User]), updateComment);

export default commentRoute;