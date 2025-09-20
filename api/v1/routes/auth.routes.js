import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate-body.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validators.js';

const AUTH_ROUTES = express.Router({mergeParams: true});

AUTH_ROUTES.post('/login', validateBody(loginValidator), login);
AUTH_ROUTES.post('/register', validateBody(registerValidator), register);

export default AUTH_ROUTES;