import express from 'express';
import { ShelfController } from '../controllers/shelf.controller.js';
import { validateObjectIdMiddleware } from '../middlewares/validate-object-id.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/my-shelves', ShelfController.getUserShelves);
router.post('/', ShelfController.createShelf);
router.patch('/:id', validateObjectIdMiddleware, ShelfController.updateShelf);
router.delete('/:id', validateObjectIdMiddleware, ShelfController.deleteShelf);

// readings de una Shelf
router.get('/:id/readings', validateObjectIdMiddleware, ShelfController.getReadingsInShelf);

// Agregar una Reading a la shelf
router.post('/readings', ShelfController.addReadingToShelf);

export default router;