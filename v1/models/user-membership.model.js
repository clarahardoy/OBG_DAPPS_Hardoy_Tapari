import mongoose from 'mongoose';

const { Schema } = mongoose;

const userMembershipSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    membershipId: { type: Schema.Types.ObjectId, ref: 'Membership', required: true },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
});

export default mongoose.model('UserMembership', userMembershipSchema);