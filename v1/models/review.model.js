import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reading: { type: Schema.Types.ObjectId, ref: 'Reading', required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default model('Review', reviewSchema);