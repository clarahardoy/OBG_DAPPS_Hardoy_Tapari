import express from 'express';
import {
    createReading,
    getAllReadings,
    getReadingById,
    updateReadingById
} from '../controllers/reading.controller.js';
import { validateBody } from '../middlewares/validate-body.middleware.js';
import { validateObjectIdMiddleware } from '../middlewares/validate-object-id.middleware.js
import { addReadingSchema } from '../validators/reading.validator.js';

const router = express.Router({ mergeParams: true });

router.post('/', validateBody(addReadingSchema), createReading);
router.get('/', getAllReadings);
router.get('/:id', validateObjectIdMiddleware, getReadingById);
router.patch('/:id', validateObjectIdMiddleware, updateReadingById);

export default router;