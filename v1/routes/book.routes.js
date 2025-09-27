import express from 'express';
import {
    createBookController,
    getBooksController,
    getBookByIdController
} from '../controllers/book.controller.js';
import { validateBody }
    from '../middlewares/validate-body.middleware.js';
import { validateObjectIdMiddleware }
    from '../middlewares/validate-object-id.middleware.js';
import { createBookSchema }
    from '../validators/book.validator.js';

router.post('/', validateBody(createBookSchema), createBookController);
router.get('/', getBooksController);
router.get('/:bookId', validateObjectIdMiddleware, getBookByIdController);

const router = express.Router({ mergeParams: true });