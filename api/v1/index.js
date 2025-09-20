import express from 'express';
import AUTH_ROUTES from './routes/auth.routes.js';
import USER_ROUTES from './routes/user.routes.js';
import { authenticate } from './middlewares/auth.middleware.js';

const router = express.Router({mergeParams: true});

//rutas desprotegidas 
router.use('/auth', AUTH_ROUTES); 

//rutas protegidas
router.use(authenticate);
router.use('/users', USER_ROUTES);

export default router;