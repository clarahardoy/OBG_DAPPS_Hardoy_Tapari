import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookSchema = new Schema({
    googleBooksId: { type: String, required: true },
    thumbnail: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    genre: { type: String, required: true },
    sinopsis: { type: String, required: true },
    eBook: { type: Boolean, required: true, default: false },
    publicationDate: { type: Date, required: true },
    publisher: { type: String, required: true },
    averageRating: { type: Number, required: true },
    ratingsCount: { type: Number, required: true },
    previewLink: { type: String, required: true },
});

export default model('Book', bookSchema);