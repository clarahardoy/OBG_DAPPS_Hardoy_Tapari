import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validateObjectIdMiddleware } from '../middlewares/validate-object-id.middleware.js';
import { validateBodyMiddleware } from '../middlewares/validate-body.middleware.js';
import { addUserSchema, updateUserSchema } from '../validators/user.validator.js';

const USER_ROUTES = express.Router({ mergeParams: true });

USER_ROUTES.get('/', UserController.getUsers);
USER_ROUTES.get('/:id', validateObjectIdMiddleware, UserController.getUserById);
USER_ROUTES.post('/', validateBodyMiddleware(addUserSchema), UserController.createUser);
USER_ROUTES.put('/:id', validateBodyMiddleware(updateUserSchema), validateObjectIdMiddleware, UserController.updateUser);
USER_ROUTES.delete('/:id', validateObjectIdMiddleware, UserController.deleteUser);

export default USER_ROUTES;