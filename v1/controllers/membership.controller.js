import { MembershipService } from '../services/membership.service.js';
export const MembershipController = {
  upgrade: async (req, res, next) => {
    try {
      const user = await MembershipService.upgradeToPremium(req.user.id);
      return res.status(200).json({
        membership: user.membership,
        maxReadings: user.getAllowedReadingsMax()
      });
    } catch (e) {
      next(e);
    }
  }
}