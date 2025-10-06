import express from 'express';
import { ShelfController } from '../controllers/shelf.controller.js';
import { validateObjectIdMiddleware } from '../middlewares/validate-object-id.middleware.js';
import { validateBodyMiddleware } from '../middlewares/validate-body.middleware.js';
import { addShelfSchema, updateShelfSchema } from '../validators/shelf.validator.js';

const SHELF_ROUTES = express.Router({ mergeParams: true });

SHELF_ROUTES.get('/my-shelves', ShelfController.getUserShelves);

SHELF_ROUTES.post('/',
    validateBodyMiddleware(addShelfSchema),
    ShelfController.createShelf);

SHELF_ROUTES.patch('/:id',
    validateBodyMiddleware(updateShelfSchema),
    validateObjectIdMiddleware,
    ShelfController.updateShelf);

SHELF_ROUTES.delete('/:id', validateObjectIdMiddleware, ShelfController.deleteShelf);

// readings de una Shelf
SHELF_ROUTES.get('/:id/readings', validateObjectIdMiddleware, ShelfController.getReadingsInShelf);

// Agregar una Reading a la shelf
SHELF_ROUTES.post('/readings', ShelfController.addReadingToShelf);

export default SHELF_ROUTES;