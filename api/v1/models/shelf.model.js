import mongoose from 'mongoose';

const { Schema } = mongoose;

const shelfSchema = new Schema({
    name: { type: String, required: true },
    books: { type: Array, required: true },
});

export default mongoose.model('Shelf', shelfSchema);