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

const router = express.Router({ mergeParams: true });

router.post('/', validateBody(addReviewSchema), createReviewController);
router.get('/', getAllReviewsController);
router.get('/:id', validateObjectIdMiddleware, getReviewByIdController);
router.delete('/:id', validateObjectIdMiddleware, deleteReviewByIdController);

export default router;