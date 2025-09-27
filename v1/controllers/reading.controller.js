import {
    createReadingService,
    getAllReadingsService,
    getReadingByIdService,
    updateReadingByIdService
} from '../services/reading.service.js';

export const createReadingController = async (req, res) => {
    try {
        const readingData = req.body;
        const newReading = await createReadingService(readingData);
        res.status(201).json({ message: "Lectura creada con éxito", newReading });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la lectura", error: error.message });
    };
};

export const getAllReadingsController = async (req, res) => {
    try {
        const readings = await getAllReadingsService();
        res.status(200).json({ message: "Lecturas cargadas con éxito ", readings });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las lecturas", error: error.message });
    };
};

export const getReadingByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const reading = await getReadingByIdService(id);
        res.status(200).json({ message: "Lectura encontrada con éxito", reading });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la lectura", error: error.message });
    };
};

export const updateReadingByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedReading = await updateReadingByIdService(id, updateData);
        res.status(200).json({ message: "Lecutra actualizada con éxito", updatedReading });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la lectura", error: error.message });
    };
};

// Eliminar lectura por id - pendiente deleteReadingByIdController