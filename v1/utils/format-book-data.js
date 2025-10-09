const formatBookData = (bookData) => {
  const volumeInfo = bookData.volumeInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};

  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  return {
    googleBooksId: bookData.id || '',
    title: volumeInfo.title || 'Título desconocido',
    author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor desconocido',
    pages: volumeInfo.pageCount || 0,
    genre: volumeInfo.categories ? volumeInfo.categories.join(', ') : 'Sin categoría',
    sinopsis: volumeInfo.description || 'Sin descripción disponible',
    eBook: bookData.saleInfo?.isEbook || false,
    publicationDate: parseDate(volumeInfo.publishedDate),
    publisher: volumeInfo.publisher || 'Editorial desconocida',
    thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || '',
    previewLink: volumeInfo.previewLink || '',
    averageRating: volumeInfo.averageRating || 0,
    ratingsCount: volumeInfo.ratingsCount || 0
  };
};

export default formatBookData;