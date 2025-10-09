import Reading from "../models/reading.model.js";
import { setReadingDates } from "../utils/set-reading-date.js";
import { ShelfService } from "./shelf.service.js";
import { UserService } from "./user.service.js";

// Agreagr una nueva lectura POST

export const ReadingService = {

    createReading: async (readingData) => {
            try {
                const shelf = await ShelfService.findShelfById(readingData.shelfId);
                const user = await UserService.getUserById(shelf.userId);
                let limit = await user.getAllowedReadingsMax();
                
                if (limit !== null) {
                    const currentCount = await ReadingService.countReadingsByShelfId(shelf._id);
                    if (currentCount >= limit) {
                        const err = new Error("Se alcanzó el límite de lecturas.");
                        err.status = 403;
                        throw err;
                    };
                };

                const newReading = new Reading(readingData);

                // Que se autocompleten las fechas según status
                setReadingDates(newReading);

                await newReading.save();

                const populatedReading = await Reading.findById(newReading._id)
                    .populate("googleBooksId")
                    .populate("shelfId");
                
                return populatedReading;
            } catch (error) {
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
        console.log('🔍 DEBUG updateReadingById:');
        console.log('  - ID:', id);
        console.log('  - updateData:', updateData);
        console.log('  - currentPage:', updateData.currentPage, '(type:', typeof updateData.currentPage, ')');
        console.log('  - pageCount:', updateData.pageCount, '(type:', typeof updateData.pageCount, ')');
        
        if (!ReadingService.pageCountIsValid(updateData.currentPage, updateData.pageCount)) {
            console.log('❌ VALIDATION FAILED:');
            console.log('  - currentPage:', updateData.currentPage);
            console.log('  - pageCount:', updateData.pageCount);
            console.log('  - Comparison result:', updateData.currentPage <= updateData.pageCount);
            const err = new Error('La página actual no puede ser mayor al total de páginas');
            err.status = 400;
            throw err;
        }
        
        console.log('✅ VALIDATION PASSED');

        // Let's also check what the existing reading looks like
        console.log('🔍 DEBUG - Checking existing reading before update:');
        const existingReading = await Reading.findById(id);
        if (existingReading) {
            console.log('  - Existing currentPage:', existingReading.currentPage);
            console.log('  - Existing pageCount:', existingReading.pageCount);
        } else {
            console.log('  - No existing reading found');
        }

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
