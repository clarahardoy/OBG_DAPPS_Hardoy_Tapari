import bookModel from "../models/book.model";

export const createBookService = async (bookData) => {
    const newBook = new bookModel(bookData);
    await newBook.save();
    return newBook;
};

export const getBooksService = async () => {
    return await bookModel.find();
};

export const getBookByIdService = async (bookId) => {
    let book;
    try {
        book = await bookModel.findById(bookId);
    } catch (error) {
        let err = new Error('Error al buscar el libro');
        err.status = 400;
        throw err;
    };

    if (!book) {
        let err = new Error('No se encontró el libro');
        err.status = 404;
        throw err;
    };

    return book;
};