import mongoose from 'mongoose';
const { Schema } = mongoose;
import RoleType from './enums/role-type.js';
import MembershipType from './enums/membership-type.enum.js';

const userSchema = new Schema({
    name: { type: String, required: false },
    surname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    membership: { type: String, enum: Object.values(MembershipType), default: MembershipType.BASIC },
    shelf: { type: Schema.Types.ObjectId, ref: 'Shelf', required: false },
    role: { type: String, enum: Object.values(RoleType), default: RoleType.USER },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    avatar: {
        url: { type: String, required: true },
        publicId: { type: String, default: null }
    }
});

userSchema.methods.getAllowedReadingsMax = function () {
    return this.membership === MembershipType.BASIC ? 10 : 100;
};

userSchema.methods.getMembershipType = function () {
    return this.membership;
};
export default mongoose.model('User', userSchema);