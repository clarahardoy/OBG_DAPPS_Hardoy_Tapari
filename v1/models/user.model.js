import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: false },
    surname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    membership: { type: Schema.Types.ObjectId, ref: 'Membership', required: false },
    shelf: { type: Schema.Types.ObjectId, ref: 'Shelf', required: false },
    role: { type: String, required: true, default: 'user', enum: ['admin', 'user'] },
   // agregar cuando este lo de vale -- reviews: lista de reviews

});

userSchema.methods.getAllowedReadingsMax = function() {
    return this.membership?.bookMax || 0;
};

export default mongoose.model('User', userSchema);