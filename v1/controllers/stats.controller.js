import User from '../models/user.model.js';
import { getUserReadingStats } from '../services/reading.service.js';

export const StatsController = {
    getMyReadingStats: async (req, res) => {
        try {
            const year = req.query.year ? Number(req.query.year) : undefined;
            const month = req.query.month ? Number(req.query.month) : undefined;
    
            const user = await User.findOne({ email: req.email }).select('_id');
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            const stats = await getUserReadingStats(user._id, { year, month });
            res.status(200).json({ message: 'Estadísticas obtenidas con éxito', stats });
        } catch (error) {
            res.status(error.status || 500).json({ message: 'Error al obtener estadísticas', error: error.message });
        }
    },
}

