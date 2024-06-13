import express from 'express';
import { createCategory, getCategories, getCategory, updateCategory } from '../controllers/category-controller';
import authenticateJwt from '../middleware/authenticate-jwt';
import checkRoles from '../middleware/check-roles';
import Role from '../enums/role';

const categoryRoute = express.Router();

categoryRoute.post('/', authenticateJwt, checkRoles([Role.Admin]), createCategory);
categoryRoute.get('/', authenticateJwt, checkRoles([Role.Admin, Role.User]), getCategories);
categoryRoute.get('/:id', authenticateJwt, checkRoles([Role.Admin, Role.User]), getCategory);
categoryRoute.put('/:id', authenticateJwt, checkRoles([Role.Admin]), updateCategory);

export default categoryRoute;