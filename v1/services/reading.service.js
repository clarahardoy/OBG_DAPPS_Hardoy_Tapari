import Reading from "../models/reading.model.js";

/* podríamos agregar getUserReadingStats() para poder hacer lo de estadisticas:
    - cantidad de libros leídos en {{ mes / año}} (getBooksReadByYear(), getBooksReadByMonth())
    - cantidad de paginas leídas en {{ mes / año}} (getTotalPagesRead())
    - genero más leido (getMostReadGenre())
*/

// Agreagr una nueva lectura POST
export const createReadingService = async (readingData) => {
    try {
        // Pensar que validaciones hacer
        const newReading = new Reading(readingData);
        await newReading.save();
        return newReading;
    } catch (error) {
        let err = new Error('Error al agregar la lectura');
        err.status = 500;
        throw err;
    }
};

// Obtener todas las lecturas GET
export const getAllReadingsService = async () => {
    // Buscar todas las lecturas y popular el campo book
    const readings = await Reading.find().populate('book');

    // Si no se encontraron lecturas avisar con error 404
    if (!readings) {
        let err = new Error('No se encontraron lecturas');
        err.status = 404;
        throw err;
    }

    // Devolver la lista de lecturas
    return readings;
}

// Obtener una lectura por ID GET
export const getReadingByIdService = async (id) => {
    let reading;
    try {
        reading = await Reading.findById(id).populate('book');
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
};

// Actualizar una lectura por ID PUT
export const updateReadingByIdService = async (id, updateData) => {
    let updatedReading;
    // Pensar que validaciones hacer
    try {
        updatedReading = await Reading.findByIdAndUpdate(id, updateData, { new: true }).populate('book');
    } catch (error) {
        let err = new Error('Error al actualizar la lectura');
        err.status = 400;
        throw err;
    };
};