import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBodyMiddleware } from '../middlewares/validate-body.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validators.js';

const AUTH_ROUTES = express.Router({mergeParams: true});

AUTH_ROUTES.post('/login', validateBodyMiddleware(loginValidator), AuthController.login);
AUTH_ROUTES.post('/register', validateBodyMiddleware(registerValidator), AuthController.register);

export default AUTH_ROUTES;