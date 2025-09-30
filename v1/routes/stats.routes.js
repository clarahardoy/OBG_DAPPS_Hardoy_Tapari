import express from 'express';
import { getMyReadingStatsController } from '../controllers/stats.controller.js';
const STATS_ROUTES = express.Router({ mergeParams: true });

// Obtener estadísticas de lecturas
STATS_ROUTES.get('/reading', getMyReadingStatsController);

export default STATS_ROUTES;