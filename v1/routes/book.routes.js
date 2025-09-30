import express from 'express';
import { BookController } from '../controllers/book.controller.js';

const BOOK_ROUTES = express.Router({ mergeParams: true });

BOOK_ROUTES.get('/search', BookController.searchBooks);
BOOK_ROUTES.get('/search/advanced', BookController.searchBooksByFilter);
BOOK_ROUTES.get('/google/:googleBooksId', BookController.getBookFromApiById);

export default BOOK_ROUTES;