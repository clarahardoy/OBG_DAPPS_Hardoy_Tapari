import formatBookData from '../utils/format-book-data.js';
import axios from 'axios';
import Book from '../models/book.model.js';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1';

export const BookService = {

  getBooksFromApi: async (query, maxResults = 10, startIndex = 0, orderBy) => {
    try {
      const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/volumes`, {
        params: {
          q: query,
          maxResults,
          startIndex,
          projection: 'full',
        }
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('No se encontraron libros');
      }

      return {
        totalItems: response.data.totalItems || 0,
        books: response.data.items.map(formatBookData)
      };
    } catch (error) {
      throw new Error(`Error en buscar libros de la API: ${error.message}`);
    }
  },

  getBooksByFilterFromApi: async (searchTerms) => {
    const { title, author, category } = searchTerms;
    let search = "";
    if (title) {
      search += `intitle:${title} `;
    }
    if (author) {
      search += `inauthor:${author} `;
    }
    if (category) {
      search += `subject:${category} `;
    }
    if (!search.trim()) {
      throw new Error('At least one search parameter is required', { status: 400 });
    }

    return BookService.getBooksFromApi(search.trim());
  },

  getBookFromApiById: async (googleBooksId) => {
    try {
      const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/volumes/${googleBooksId}`);
      return formatBookData(response.data);
    } catch (error) {
      throw new Error(`Error al obtener libro de Google Books: ${error.message}`);
    }
  },

  findBookByGoogleBooksId: async (googleBooksId) => {
    try {
      const book = await Book.findOne({ googleBooksId });
      return book;
    } catch (error) {
      throw new Error(`Error al buscar libro: ${error.message}`);
    }
  },

  createBook: async (bookData) => {
    try {
      const book = await Book.create(bookData);
      return book;
    } catch (error) {
      throw new Error(`Error al crear libro: ${error.message}`);
    }
  },

  findOrCreateBook: async (googleBooksId) => {
    try {
      let book = await BookService.findBookByGoogleBooksId(googleBooksId);
      if (!book) {
        // si no existe, buscar de google books y crearlo en la
        const googleBookData = await BookService.getBookFromApiById(googleBooksId);
        book = await BookService.createBook(googleBookData);
      }
      return book;
    } catch (error) {
      throw new Error(`Error al buscar libro: ${error.message}`);
    }
  },

  getBookById: async (bookId) => {
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Libro no encontrado');
      }
      return book;
    } catch (error) {
      throw new Error(`Error al obtener libro: ${error.message}`);
    }
  }
};
