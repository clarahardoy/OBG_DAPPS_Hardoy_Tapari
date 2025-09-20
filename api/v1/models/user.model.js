import mongoose from 'mongoose';
import ShelfModel from './shelf.model.js';
import MembershipModel from './membership.model.js';

const { Schema } = mongoose;

const userSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    surname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    membership: { type: MembershipModel, required: false },
    shelf: { type: ShelfModel, required: false },
    role: { type: String, required: true, default: 'user', enum: ['admin', 'user'] },
   // agregar cuando este lo de vale -- reviews: { type: ReviewModel, required: true },

});

export default mongoose.model('User', userSchema);