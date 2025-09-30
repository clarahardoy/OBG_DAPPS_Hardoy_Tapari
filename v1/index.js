import express from 'express';
import AUTH_ROUTES from './routes/auth.routes.js';
import USER_ROUTES from './routes/user.routes.js';
import READING_ROUTES from './routes/reading.routes.js';
import REVIEW_ROUTES from './routes/review.routes.js';
import BOOK_ROUTES from './routes/book.routes.js';
import SHELF_ROUTES from './routes/shelf.routes.js';
import STATS_ROUTES from './routes/stats.routes.js';
import { authenticateMiddleware } from './middlewares/authenticate.middleware.js';
import { authorizeRoleMiddleware } from './middlewares/authorize-role.middleware.js';

const router = express.Router({ mergeParams: true });

//rutas desprotegidas 
router.use('/auth', AUTH_ROUTES);

//rutas protegidas
router.use(authenticateMiddleware);
router.use('/stats', STATS_ROUTES);
router.use('/readings', READING_ROUTES);
router.use('/shelves', SHELF_ROUTES);
router.use('/reviews', REVIEW_ROUTES);
router.use('/books', BOOK_ROUTES);
router.use('/users', authorizeRoleMiddleware(['admin']), USER_ROUTES);

export default router;