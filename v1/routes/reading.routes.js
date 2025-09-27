import express from 'express';
import {
    createReadingContoller,
    getAllReadingsController,
    getReadingByIdController,
    updateReadingByIdController
} from '../controllers/reading.controller.js';
import { validateBody }
    from '../middlewares/validate-body.middleware.js';
import { validateObjectIdMiddleware }
    from '../middlewares/validate-object-id.middleware.js
import { addReadingSchema }
    from '../validators/reading.validator.js';

const router = express.Router({ mergeParams: true });

router.post('/', validateBody(addReadingSchema), createReadingContoller);
router.get('/', getAllReadingsController);
router.get('/:id', validateObjectIdMiddleware, getReadingByIdController);
router.patch('/:id', validateObjectIdMiddleware, updateReadingByIdController);

export default router;