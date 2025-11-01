import mongoose from 'mongoose';

const { Schema } = mongoose;

const shelfSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	name: { type: String, required: true },
	readings: { type: Array, required: true, ref: 'Reading' },
	isDefault: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

shelfSchema.methods.countReadings = function () {
	return this.readings.length;
};

export default mongoose.model('Shelf', shelfSchema);
