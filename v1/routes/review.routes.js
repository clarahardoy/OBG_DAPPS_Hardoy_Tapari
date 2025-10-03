import express from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { validateBody }
    from '../middlewares/validate-body.middleware.js';
import { validateObjectIdMiddleware }
    from '../middlewares/validate-object-id.middleware.js';
import { addReviewSchema }
    from '../validators/review.validators.js';

const REVIEW_ROUTES = express.Router({ mergeParams: true });

REVIEW_ROUTES.post('/', validateBody(addReviewSchema), ReviewController.createReview);
REVIEW_ROUTES.get('/', ReviewController.getAllReviews);
REVIEW_ROUTES.get('/:id', validateObjectIdMiddleware, ReviewController.getReviewById);
REVIEW_ROUTES.delete('/:id', validateObjectIdMiddleware, ReviewController.deleteReviewById);

export default REVIEW_ROUTES;