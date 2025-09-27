import { createBookService, getBooksService, getBookByIdService } from "../services/book.service.js";
// Conumir acá la API de libros, req: infoBook de la API externa

export const createBookController = async (req, res) => {
    try {
        const bookData = req.body;
        const newBook = await createBookService(bookData);
        res.status(201).json({ message: "Libro creado con éxito", newBook });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el libro", error: error.message });
    };
};

export const getBooksController = async (req, res) => {
    try {
        const books = await getBooksService();
        res.status(200).json({ message: "Libros cargados con éxito ", books });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los libros", error: error.message });
    };
};

export const getBookByIdController = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await getBookByIdService(bookId);
        res.status(200).json({ message: "Libro encontrado con éxito", book });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el libro", error: error.message });
    };
};import { searchBooksService, searchBooksByFilterService } from '../services/google-books.service.js';

export const searchBooks = async (req, res) => {
    const { query, maxResults, startIndex, orderBy } = req.query;
    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Se necesita un término de búsqueda', error: error.messageå });
    }
    try {
        const books = await searchBooksService(query, maxResults, startIndex, orderBy);
        if (!books) {
            return res.status(404).json({ error: 'No se encontraron libros', error: error.message });
        }
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ error: 'Error al buscar libros', error: error.message });
    }
}

export const searchBooksByFilter = async (req, res) => {   
    try {
        const parameters = req.body;
        const books = await searchBooksByFilterService(parameters);
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ error: 'Error al buscar libros', error: error.message });
    }
}