import express from 'express';
import { StatsController } from '../controllers/stats.controller.js';
const STATS_ROUTES = express.Router({ mergeParams: true });

// Obtener estadísticas de lecturas
STATS_ROUTES.get('/reading', StatsController.getMyReadingStats);

export default STATS_ROUTES;