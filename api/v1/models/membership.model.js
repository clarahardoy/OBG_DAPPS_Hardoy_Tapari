import mongoose from 'mongoose';
const { Schema } = mongoose;

const membershipSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    bookMax: { type: Number, required: true },
});

export default mongoose.model('Membership', membershipSchema);