
import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { validateObjectIdMiddleware } from '../middlewares/validate-object-id.middleware.js';

const USER_ROUTES = express.Router({mergeParams: true});

USER_ROUTES.get('/', getUsers); 
USER_ROUTES.get('/:id', validateObjectIdMiddleware, getUserById);
USER_ROUTES.post('/', createUser);
USER_ROUTES.put('/:id', validateObjectIdMiddleware, updateUser);
USER_ROUTES.delete('/:id', validateObjectIdMiddleware, deleteUser);

export default USER_ROUTES;