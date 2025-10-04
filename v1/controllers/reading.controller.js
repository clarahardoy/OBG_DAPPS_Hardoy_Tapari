import { ReadingService } from '../services/reading.service.js';

export const ReadingController = {
    createReading: async (req, res) => {
        try {
            const readingData = req.body;
            const newReading = await ReadingService.createReading(readingData);
            res.status(201).json({ message: "Lectura creada con éxito", newReading });
        } catch (error) {
            res.status(500).json({ message: "Error al crear la lectura", error: error.message });
        };
    },

    getAllReadings: async (req, res) => {
        try {
            const readings = await ReadingService.getAllReadings();
            res.status(200).json({ message: "Lecturas cargadas con éxito ", readings });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener las lecturas", error: error.message });
        };
    },

    getReadingById: async (req, res) => {
        try {
            const { id } = req.params;
            const reading = await ReadingService.getReadingById(id);
            res.status(200).json({ message: "Lectura encontrada con éxito", reading });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener la lectura", error: error.message });
        };
    },

    updateReadingById: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedReading = await ReadingService.updateReadingById(id, updateData);
            res.status(200).json({ message: "Lectura actualizada con éxito", updatedReading });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar la lectura", error: error.message });
        };
    },

    deleteReadingById: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedReading = await ReadingService.deleteReadingById(id);
            res.status(200).json({ message: "Lectura eliminada con éxito", deletedReading });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar la lectura", error: error.message });
        };
    },
};