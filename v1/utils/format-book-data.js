const formatBookData = (bookData) => {
    const volumeInfo = bookData.volumeInfo || {};
    const imageLinks = volumeInfo.imageLinks || {};
    
    return {
        //ver cuales necesitamos y cuales no
      googleBooksId: bookData.id,
      title: volumeInfo.title || 'Unknown Title',
      author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
      pages: volumeInfo.pageCount || null,
      genre: volumeInfo.categories ? volumeInfo.categories.join(', ') : null,
      synopsis: volumeInfo.description || null,
      eBook: bookData.saleInfo?.isEbook || false,
      publishedDate: volumeInfo.publishedDate || null,
      publisher: volumeInfo.publisher || null,
      thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || null,
      previewLink: volumeInfo.previewLink || null,
      averageRating: volumeInfo.averageRating || null,
      ratingsCount: volumeInfo.ratingsCount || null
    };
  }

  export default formatBookData;