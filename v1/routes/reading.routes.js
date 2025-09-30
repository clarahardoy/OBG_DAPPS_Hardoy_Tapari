import express from 'express';
import {
    createReadingController,
    getAllReadingsController,
    getReadingByIdController,
    updateReadingByIdController,
    deleteReadingByIdController
} from '../controllers/reading.controller.js';
import { validateBody }
    from '../middlewares/validate-body.middleware.js';
import { validateObjectIdMiddleware }
    from '../middlewares/validate-object-id.middleware.js';
import { addReadingSchema, updateReadingSchema }
    from '../validators/reading.validators.js';

const READING_ROUTES = express.Router({ mergeParams: true });

READING_ROUTES.post('/', validateBody(addReadingSchema), createReadingController);
READING_ROUTES.get('/', getAllReadingsController);
READING_ROUTES.get('/:id', validateObjectIdMiddleware, getReadingByIdController);
READING_ROUTES.patch('/:id', validateObjectIdMiddleware, validateBody(updateReadingSchema), updateReadingByIdController);
READING_ROUTES.delete('/:id', validateObjectIdMiddleware, deleteReadingByIdController);

export default READING_ROUTES;