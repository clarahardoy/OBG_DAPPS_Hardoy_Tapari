import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reading: { type: Schema.Types.ObjectId, ref: 'Reading', required: true, index: true },
    title: { type: String, required: true, maxlength: 100 },
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: { type: String, required: true, minlength: 10, maxlength: 1000 }
}
);

export default model('Review', reviewSchema);