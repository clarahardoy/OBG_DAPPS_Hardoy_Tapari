import {
    createReadingService,
    getAllReadingsService,
    getReadingByIdService,
    updateReadingByIdService
} from '../services/reading.service.js';

export const createReadingController = async (req, res) => {
    const readingData = req.body;
    const newReading = await createReadingService(readingData);
    res.status(201).json(newReading);
};

export const getAllReadingsController = async (req, res) => {
    const readings = await getAllReadingsService();
    res.status(200).json(readings);
};

export const getReadingByIdController = async (req, res) => {
    const { id } = req.params;
    const reading = await getReadingByIdService(id);
    res.status(200).json(reading);
};

export const updateReadingByIdController = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedReading = await updateReadingByIdService(id, updateData);
    res.status(200).json(updatedReading);
};

// Hacemos un eliminar reading?