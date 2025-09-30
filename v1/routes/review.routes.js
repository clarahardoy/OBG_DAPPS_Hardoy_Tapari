import express from 'express';
import {
    createReviewController,
    getAllReviewsController,
    getReviewByIdController,
    deleteReviewByIdController
} from '../controllers/review.controller.js';
import { validateBody }
    from '../middlewares/validate-body.middleware.js';
import { validateObjectIdMiddleware }
    from '../middlewares/validate-object-id.middleware.js';
import { addReviewSchema }
    from '../validators/review.validators.js';

const REVIEW_ROUTES = express.Router({ mergeParams: true });

REVIEW_ROUTES.post('/', validateBody(addReviewSchema), createReviewController);
REVIEW_ROUTES.get('/', getAllReviewsController);
REVIEW_ROUTES.get('/:id', validateObjectIdMiddleware, getReviewByIdController);
REVIEW_ROUTES.delete('/:id', validateObjectIdMiddleware, deleteReviewByIdController);

export default REVIEW_ROUTES;