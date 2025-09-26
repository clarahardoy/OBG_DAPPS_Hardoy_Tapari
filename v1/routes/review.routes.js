import express from 'express';
improt {
    createReviewController,
        getAllReviewsController,
        getReviewByIdController,
        updateReviewByIdController
} from '../controllers/review.controller.js';
import { validateBody } from '../middlewares/validate-body.middleware.js';
import { validateObjectIdMiddleware } from '../middlewares/validate-object-id.middleware.js';
import { addReviewSchema } from '../validators/review.validator.js';

const router = express.Router({ mergeParams: true });

router.post('/', validateBody(addReviewSchema), createReviewController);
router.get('/', getAllReviewsController);
router.get('/:id', validateObjectIdMiddleware, getReviewByIdController);
router.patch('/:id', validateObjectIdMiddleware, updateReviewByIdController);

export default router;