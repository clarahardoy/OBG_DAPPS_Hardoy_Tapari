import express from 'express';
import { ReadingController } from '../controllers/reading.controller.js';
import { validateBodyMiddleware }  from '../middlewares/validate-body.middleware.js';
import { validateObjectIdMiddleware }  from '../middlewares/validate-object-id.middleware.js';
import { addReadingSchema, updateReadingSchema } from '../validators/reading.validators.js';

const READING_ROUTES = express.Router({ mergeParams: true });

READING_ROUTES.post('/', validateBodyMiddleware(addReadingSchema), ReadingController.createReading);
READING_ROUTES.get('/', ReadingController.getAllReadings);
READING_ROUTES.get('/:id', validateObjectIdMiddleware, ReadingController.getReadingById);
READING_ROUTES.patch('/:id', validateObjectIdMiddleware, validateBodyMiddleware(updateReadingSchema), ReadingController.updateReadingById);
READING_ROUTES.delete('/:id', validateObjectIdMiddleware, ReadingController.deleteReadingById);

export default READING_ROUTES;