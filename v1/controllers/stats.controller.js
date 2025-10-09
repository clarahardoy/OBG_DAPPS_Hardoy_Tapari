import User from '../models/user.model.js';
import { StatsService } from '../services/stats.service.js';
import { validateMonthYear } from '../utils/validate-month-year.js';

export const StatsController = {
    getMyReadingStats: async (req, res) => {
        try {
            const year = req.query.year ? Number(req.query.year) : undefined;
            const month = req.query.month ? Number(req.query.month) : undefined;

            validateMonthYear(month, year);

            const user = await User.findOne({ email: req.email }).select('_id');
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const stats = await StatsService.getUserReadingStats(user._id, { year, month });
            res.status(200).json({ message: 'Estadísticas obtenidas con éxito', stats });
        } catch (error) {
            const status = error.status || 500;
            const errorResponse = {
                message: status === 400 ? error.message : 'Error al obtener estadísticas',
                error: error.message
            };
            res.status(status).json(errorResponse);
        }
    },
};