import Reading from "../models/reading.model.js";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import { setReadingDateMiddleware } from "../middlewares/setReadingDate.middleware.js";
import { ShelfService } from "./shelf.service.js";
import { UserService } from "./user.service.js";
import { ReadingService } from "./reading.service.js";

// Agreagr una nueva lectura POST

export const ReadingService = {

    createReading: async (readingData) => {
            try {

                //Regla de negocio: límite por membresía
                // Plus -> máx 10 Readings
                // Premium -> ilimitado 

                const shelf = await ShelfService.findShelfById(readingData.shelfId);
                const user = await UserService.getUserById(shelf.userId);

                let limit = null;
                const m = user.membership;
                if (m?.name?.toLowerCase() === "plus") limit = 10;
                if (m?.name?.toLowerCase() === "premium") limit = null;
                if (typeof m?.bookMax === "number") limit = m.bookMax;

                if (limit !== null) {
                    const currentCount = await ReadingService.countReadingsByShelfId(shelf._id);
                    if (currentCount >= limit) {
                        const err = new Error("Alcanzaste el límite. Si deseas subir más lecturas suscríbete al plan Premium.");
                        err.status = 403;
                        throw err;
                    };
                };

                const newReading = new Reading(readingData);
                // Que se autocompleten las fechas según status
                setReadingDateMiddleware(newReading);
                await newReading.save();
                return await Reading.findById(newReading._id)
                    .populate("bookId")
                    .populate("shelfId");
            } catch (error) {
                let err = new Error('Error al agregar la lectura');
                err.status = 500;
                throw err;
            };
        },

    getAllReadings: async () => {
        // Buscar todas las lecturas y popular el campo book
        const readings = await Reading.find()
            .populate("bookId")
            .populate("shelfId");

        // Si no se encontraron lecturas avisar con error 404
        if (!readings || readings.length === 0) {
            let err = new Error('No se encontraron lecturas');
            err.status = 404;
            throw err;
        };

        // Devolver la lista de lecturas
        return readings;
    },

    // Obtener una lectura por ID GET
    getReadingById: async (id) => {
        let reading;
        try {
            reading = await Reading.findById(id)
                .populate("bookId")
                .populate("shelfId");
        } catch (error) {
            let err = new Error('Error al encotrar la lectura');
            err.status = 400;
            throw err;
        };

        if (!reading) {
            let err = new Error('No se encontró la lectura');
            err.status = 404;
            throw err;
        };

        return reading;
    },
    // Actualizar una lectura por ID PUT
    updateReadingById: async (id, updateData) => {
        // Aseguramos formato de "update operator" para que el middleware pueda operar ($set/$unset)
        const update = { $set: { ...updateData } };

        // Aplica reglas de fechas/updatedAt según status/cambios
        setReadingDateMiddleware(update);

        let updatedReading;
        try {
            updatedReading = await Reading.findByIdAndUpdate(id, update, {
                new: true,
                runValidators: true, // valida contra el schema
            })
                .populate("bookId")
                .populate("shelfId");
        } catch (error) {
            let err = new Error('Error al actualizar la lectura');
            err.status = 400;
            throw err;
        };

        if (!updatedReading) {
            const err = new Error("No se encontró la lectura para actualizar");
            err.status = 404;
            throw err;
        };

        return updatedReading;
    },

    deleteReadingById: async (id) => {
        let deleted;
        try {
            deleted = await Reading.findByIdAndDelete(id);
        } catch {
            const err = new Error("Error al eliminar la lectura");
            err.status = 400;
            throw err;
        };
        if (!deleted) {
            const err = new Error("No se encontró la lectura para eliminar");
            err.status = 404;
            throw err;
        };
        return deleted;
    },
}