
import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validateObjectIdMiddleware } from '../middlewares/validate-object-id.middleware.js';

const USER_ROUTES = express.Router({ mergeParams: true });

USER_ROUTES.get('/', UserController.getUsers);
USER_ROUTES.get('/:id', validateObjectIdMiddleware, UserController.getUserById);
USER_ROUTES.post('/', UserController.createUser);
USER_ROUTES.put('/:id', validateObjectIdMiddleware, UserController.updateUser);
USER_ROUTES.delete('/:id', validateObjectIdMiddleware, UserController.deleteUser);

export default USER_ROUTES;