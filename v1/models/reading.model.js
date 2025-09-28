import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const readingSchema = new Schema({
    shelfId: { type: Schema.Types.ObjectId, ref: 'Shelf', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    status: { type: String, enum: ['FINISHED', 'ABANDONED', 'CURRENTLY_READING', 'WANT_TO_READ'], required: true },
    startedReading: { type: Date },
    finishedReading: { type: Date },
    pageCount: { type: Number, required: true },
    currentPage: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default model('Reading', readingSchema);