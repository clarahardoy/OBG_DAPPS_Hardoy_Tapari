import express from 'express';
import { BookController } from '../controllers/book.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/search', BookController.searchBooks);
router.get('/search/advanced', BookController.searchBooksByFilter);
router.get('/google/:googleBooksId', BookController.getBookFromApiById);

export default router;