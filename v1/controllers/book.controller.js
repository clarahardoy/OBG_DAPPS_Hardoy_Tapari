import { BookService } from "../services/book.service.js";

export const BookController = {

    searchBooks: async (req, res) => {
        try {
            const { q: query, maxResults = 10, startIndex = 0 } = req.query;

            if (!query || query.trim() === '') {
                return res.status(400).json({
                    error: "Parámetro de búsqueda 'q' es requerido"
                });
            }

            const results = await BookService.getBooksFromApi(
                query.trim(),
                parseInt(maxResults),
                parseInt(startIndex)
            );

            res.status(200).json({
                message: "Búsqueda realizada con éxito",
                ...results
            });

        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ error: error.message });
        }
    },

    searchBooksByFilter: async (req, res) => {
        try {
            const { title, author, category, maxResults = 10, startIndex = 0 } = req.query;

            if (!title && !author && !category) {
                return res.status(400).json({
                    error: "Al menos un filtro es requerido: title, author, o category"
                });
            }

            const searchTerms = {};
            if (title) searchTerms.title = title.trim();
            if (author) searchTerms.author = author.trim();
            if (category) searchTerms.category = category.trim();

            const results = await BookService.getBooksByFilterFromApi(searchTerms);

            res.status(200).json({
                message: "Búsqueda con filtros exitosa",
                filters: searchTerms,
                ...results
            });

        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ error: error.message });
        }
    },

    getBookFromApiById: async (req, res) => {
        try {
            const { googleBooksId } = req.params;

            if (!googleBooksId) {
                return res.status(400).json({
                    error: "Google Books ID es requerido"
                });
            }

            const book = await BookService.getBookFromApiById(googleBooksId);

            res.status(200).json({
                message: "Libro obtenido con éxito",
                book
            });

        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ error: error.message });
        }
    },
};
