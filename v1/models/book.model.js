import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    gener: { type: String, required: true },
    sinopsis: { type: String, required: true },
    eBook: { type: Boolean, required: true, default: false },
    publicationDate: { type: Date, required: true }
});

export default model('Book', bookSchema);