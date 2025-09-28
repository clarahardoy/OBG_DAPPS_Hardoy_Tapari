import { ReadingService } from "./reading.service.js";
import Shelf from "../models/shelf.model.js";
import { UserService } from "./user.service.js";
import { MembershipType } from "../models/enums/membership-type.enum.js";

export const ShelfService = {

    createShelf: async (shelfData) => {
        try {
            const newShelf = await Shelf.create(shelfData);
            return newShelf;
        } catch (error) {
            throw new Error('Error al crear la shelf', error, { status: 400 })
        }
    },

    updateShelf: async (shelfId, shelfData) => {
        try {
            const updatedShelf = await Shelf.findByIdAndUpdate(shelfId, shelfData, { new: true });
            if (!updatedShelf) {
                throw new Error('Shelf no encontrada');
            }
            return updatedShelf;
        } catch (error) {
            throw new Error('Error al actualizar la shelf', error, { status: 400 })
        }
    },

    deleteShelf: async (shelfId) => {
        try {
            await ReadingService.deleteReadingsByShelfId(shelfId);
            const deletedShelf = await Shelf.findByIdAndDelete(shelfId);
            if (!deletedShelf) {
                throw new Error('Shelf no encontrada');
            }
            return { message: "Shelf eliminada con éxito" };
        } catch (error) {
            throw new Error('Error al eliminar la shelf', error, { status: 400 })
        }
    },

    findShelfById: async (shelfId) => {
        try {
            if (!shelfId) {
                throw new Error('Shelf ID no encontrado', { status: 404 });
            }
            const shelf = await Shelf.findById(shelfId);
            if (!shelf) {
                throw new Error('Shelf no encontrada');
            }
            return shelf;
        } catch (error) {
            throw new Error('Error al encontrar la shelf', error, { status: 400 })
        }
    },

    getReadingsInShelf: async (shelfId) => {
        try {
            if (!shelfId) {
                throw new Error('Shelf ID requerido');
            }
            const readings = await ReadingService.getReadingsByShelfId(shelfId);
            return readings;
        } catch (error) {
            throw new Error(`Error al obtener las lecturas: ${error.message}`);
        }
    },

    shelfHasSpaceLeft: async (shelfId, userId) => {
       try {
        const user = await UserService.getUserById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado', { status: 404 });
        }
        const amountOfReadingsNow = await ReadingService.countReadingsByShelfId(shelfId);
        if (amountOfReadingsNow >= user.getAllowedReadingsMax()) {
            throw new Error(`Límite de ${allowedMax} libros alcanzado para el plan actual`);
        }
       } catch (error) {
            throw error; 
        }
        return true;
    },

    canCreateMoreThanOneShelf: async (userId) => {
        try {
        const user = await UserService.getUserById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado', { status: 404 });
        }
        return user.getMembershipType() === MembershipType.PREMIUM;
        } catch (error) {
            throw new Error(`Error al validar: ${error.message}`);
        }
    },
};  