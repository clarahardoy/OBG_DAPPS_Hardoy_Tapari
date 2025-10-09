import mongoose from 'mongoose';
const { Schema, model } = mongoose;

import { ReadingStatus } from './enums/reading-status.enum.js';

const readingSchema = new Schema({
    shelfId: { type: Schema.Types.ObjectId, ref: 'Shelf', required: true, index: true },
    googleBooksId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    status: { type: String, enum: Object.values(ReadingStatus), required: true },
    startedReading: { type: Date },
    finishedReading: { type: Date },
    pageCount: { type: Number, required: true },
    currentPage: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default model('Reading', readingSchema);