import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const readingSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    status: { type: String, enum: ['FINISHED', 'ABANDONED', 'CURRENTLY_READING', 'WANT_TO_READ'], required: true },
    startedReainding: { type: Date, default: Date.now },
    finishedReading: { type: Date },
    pageCount: { type: Number, required: true },
    currentPage: { type: Number, default: 0 },
});

export default model('Reading', readingSchema);