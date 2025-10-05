import { ShelfService } from '../services/shelf.service.js';
import { ReadingService } from '../services/reading.service.js';
import { BookService } from '../services/book.service.js';

export const ShelfController = {

    getReadingsInShelf: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            await ShelfService.validateShelfBelongsToUser(id, userId);

            const readings = await ShelfService.getReadingsInShelf(id);
            res.status(200).json({
                message: "Lecturas cargadas con éxito",
                readings
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getUserShelves: async (req, res) => {
        try {
            const userId = req.user.id;
            const shelves = await ShelfService.getUserShelves(userId);
            res.status(200).json({
                message: "Shelves cargadas con éxito",
                shelves
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    createShelf: async (req, res) => {
        try {
            const userId = req.user.id;
            const { shelfName } = req.body;

            const canCreateMultiple = await ShelfService.canCreateMoreThanOneShelf(userId);
            if (!canCreateMultiple) {
                return res.status(403).json({
                    error: "Plan no válido para crear más de una shelf"
                });
            }

            const shelfData = {
                userId,
                name: shelfName,
                isDefault: false
            };

            const newShelf = await ShelfService.createShelf(shelfData);
            res.status(201).json({
                message: "Shelf creada con éxito",
                shelf: newShelf
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    addReadingToShelf: async (req, res) => {
        try {
            const { id, googleBooksId, status = 'WANT_TO_READ' } = req.body;
            const userId = req.user.id;

            await ShelfService.validateShelfBelongsToUser(id, userId);
            await ShelfService.validateShelfHasSpaceLeft(id, userId);
            const book = await BookService.findOrCreateBook(googleBooksId);

            const readingData = {
                shelfId: id,
                bookId: book._id,
                status
            };

            const newReading = await ReadingService.createReading(readingData);

            res.status(201).json({
                message: "Lectura agregada con éxito",
                reading: newReading
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteReadingFromShelf: async (req, res) => {
        try {
            const { readingId } = req.params;
            const userId = req.user.id;

            const reading = await ReadingService.getReadingById(readingId);
            if (!reading) {
                return res.status(404).json({ error: "Lectura no encontrada" });
            }
            await ShelfService.validateShelfBelongsToUser(reading.id, userId);
            await ReadingService.deleteReading(readingId);
            res.status(200).json({ message: "Lectura eliminada con éxito" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    updateShelf: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const updateData = req.body;

            await ShelfService.validateShelfBelongsToUser(id, userId);
            const updatedShelf = await ShelfService.updateShelf(id, updateData);

            res.status(200).json({
                message: "Shelf actualizada con éxito",
                shelf: updatedShelf
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteShelf: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const shelf = await ShelfService.validateShelfBelongsToUser(id, userId);

            if (shelf.isDefault) {
                return res.status(400).json({
                    error: "No se puede eliminar la biblioteca principal"
                });
            }

            await ShelfService.deleteShelf(id);
            res.status(200).json({ message: "Shelf eliminada con éxito" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    validateShelfHasSpaceLeft: async (req, res) => {
        const { id } = req.params;
        const { userId } = req.params;
        const hasSpaceLeft = await ShelfService.shelfHasSpaceLeft(id, userId);
        res.status(200).json({ message: "Shelf tiene espacio libre", hasSpaceLeft });
    },
};