import Reading from "../models/reading.model.js";
import { setReadingDates } from "../utils/set-reading-date.js";
import { ShelfService } from "./shelf.service.js";
import { UserService } from "./user.service.js";

// Agreagr una nueva lectura POST

export const ReadingService = {

    createReading: async (readingData) => {
        try {
            console.log('ReadingService.createReading called with:', readingData);

            console.log('Finding shelf by ID...');
            const shelf = await ShelfService.findShelfById(readingData.shelfId);
            console.log('Shelf found:', { shelfId: shelf._id, userId: shelf.userId });

            console.log('Finding user by ID...');
            const user = await UserService.getUserById(shelf.userId);
            console.log('User found:', { userId: user._id });

            console.log('Checking reading limits...');
            let limit = await user.getAllowedReadingsMax();
            console.log('User reading limit:', limit);

            if (limit !== null) {
                const currentCount = await ReadingService.countReadingsByShelfId(shelf._id);
                console.log('Current readings count:', currentCount);
                if (currentCount >= limit) {
                    const err = new Error("Se alcanzó el límite de lecturas.");
                    err.status = 403;
                    throw err;
                };
            };

            console.log('Creating new Reading object...');
            const newReading = new Reading(readingData);
            console.log('Reading object created:', newReading);

            console.log('Setting reading dates...');
            // Que se autocompleten las fechas según status
            setReadingDates(newReading);
            console.log('Reading dates set:', {
                startedReading: newReading.startedReading,
                finishedReading: newReading.finishedReading
            });

            console.log('Saving reading to database...');
            await newReading.save();
            console.log('Reading saved successfully, ID:', newReading._id);

            console.log('Populating reading with book and shelf data...');
            const populatedReading = await Reading.findById(newReading._id)
                .populate("googleBooksId")
                .populate("shelfId");
            console.log('Reading populated successfully');

            return populatedReading;
        } catch (error) {
            console.error('Error in ReadingService.createReading:', error);
            let err = new Error(`Error al agregar la lectura: ${error.message}`);
            err.status = error.status || 500;
            throw err;
        };
    },

    getAllReadings: async () => {
        // Buscar todas las lecturas y popular el campo book
        const readings = await Reading.find()
            .populate("googleBooksId")
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
                .populate("googleBooksId")
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
        if (!ReadingService.pageCountIsValid(updateData.currentPage, updateData.pageCount)) {
            const err = new Error('La página actual no puede ser mayor al total de páginas');
            err.status = 400;
            throw err;
        };

        // Aseguramos formato de "update operator" para que el middleware pueda operar ($set/$unset)
        const update = { $set: { ...updateData } };

        // Aplica reglas de fechas/updatedAt según status/cambios
        setReadingDates(update);

        let updatedReading;
        try {
            updatedReading = await Reading.findByIdAndUpdate(id, update, {
                new: true,
                runValidators: true, // valida contra el schema
            })
                .populate("googleBooksId")
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

    countReadingsByShelfId: async (shelfId) => {
        return await Reading.countDocuments({ shelfId });
    },

    pageCountIsValid: (currentPage, pageCount) => {
        return currentPage <= pageCount;
    },
}