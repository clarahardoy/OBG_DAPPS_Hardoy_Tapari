import mongoose from 'mongoose';

const { Schema } = mongoose;

const shelfSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    books: { type: Array, required: true },
});

export default mongoose.model('Shelf', shelfSchema);