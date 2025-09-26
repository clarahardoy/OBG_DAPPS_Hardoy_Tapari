import { searchBooksService, searchBooksByFilterService } from '../services/google-books.service.js';

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