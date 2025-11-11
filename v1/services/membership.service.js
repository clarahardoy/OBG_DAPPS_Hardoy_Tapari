import User from '../models/user.model.js';
import { MembershipType } from '../models/enums/membership-type.enum.js';

export const MembershipService = {
    upgradeToPremium: async (userId) => {
        const user = await User.findById(userId);
        if (!user) {
            const err = new Error('Usuario no encontrado'); err.status = 404; throw err;
        }
        if (user.membership === MembershipType.PREMIUM) {
            const err = new Error('Ya sos PREMIUM'); err.status = 409; throw err;
        }
        if (user.membership !== MembershipType.BASIC) {
            const err = new Error('No podés cambiar desde este plan'); err.status = 403; throw err;
        }
        user.membership = MembershipType.PREMIUM;
        await user.save();
        return user;
    }
};