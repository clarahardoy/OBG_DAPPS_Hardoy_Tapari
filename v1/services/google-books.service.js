import formatBookData from '../utils/format-book-data.js';
import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1';

export const searchBooksService = async (query, maxResults = 10, startIndex = 0, orderBy) => {
    const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/volumes`, {
        params: {
          q: query, // puede ser: (title, author, category)
          maxResults,
          startIndex,
          projection: 'full',
        }

      });
      if (response.data.items.length === 0) {
        throw new Error('No se encontraron libros', { status: 404 });
      }

      return {
        totalItems: response.data.totalItems || 0,
        books: response.data.items?.map(formatBookData) || []
    }
  }

export const searchBooksByFilterService = async (searchTerms) => {
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

    return searchBooksService(search.trim());
}