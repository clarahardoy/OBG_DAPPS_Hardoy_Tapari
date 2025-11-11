import express from 'express';
import { MembershipController } from '../controllers/membership.controller.js';

const MEMBERSHIP_ROUTES = express.Router({ mergeParams: true });

MEMBERSHIP_ROUTES.post('/upgrade', MembershipController.upgrade);

export default MEMBERSHIP_ROUTES;