import { createBookService, getBooksService, getBookByIdService } from "../services/book.service.js";

export const createBookController = async (req, res) => {
    const bookData = req.body;
    const newBook = await createBookService(bookData);
    res.status(201).json(newBook);
};

export const getBooksController = async (req, res) => {
    const books = await getBooksService();
    res.status(200).json(books);
};

export const getBookByIdController = async (req, res) => {
    const { bookId } = req.params;
    const book = await getBookByIdService(bookId);
    res.status(200).json(book);
};