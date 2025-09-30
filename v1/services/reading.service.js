import Reading from "../models/reading.model.js";
import Shelf from "../models/shelf.model.js";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import { setReadingDateMiddleware } from "../middlewares/setReadingDate.middleware.js";

// Agreagr una nueva lectura POST
export const createReadingService = async (readingData) => {
    try {

        //Regla de negocio: límite por membresía
        // Plus -> máx 10 Readings
        // Premium -> ilimitado 

        const shelf = await Shelf.findById(readingData.shelfId);
        if (!shelf) {
            const err = new Error("La estantería no existe");
            err.status = 404;
            throw err;
        };

        const user = await User.findById(shelf.userId).populate("membership");
        if (!user) {
            const err = new Error("Usuario no encontrado");
            err.status = 404;
            throw err;
        };

        let limit = null;
        const m = user.membership;
        if (m?.name?.toLowerCase() === "plus") limit = 10;
        if (m?.name?.toLowerCase() === "premium") limit = null;
        if (typeof m?.bookMax === "number") limit = m.bookMax;

        if (limit !== null) {
            const currentCount = await Reading.countDocuments({ shelfId: shelf._id });
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
};

// Obtener todas las lecturas GET
export const getAllReadingsService = async () => {
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
};

// Obtener una lectura por ID GET
export const getReadingByIdService = async (id) => {
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
};

// Actualizar una lectura por ID PUT
export const updateReadingByIdService = async (id, updateData) => {
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
};

export const deleteReadingByIdService = async (id) => {
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
};

/* ======================= ESTADÍSTICAS ======================= */
/*
   - getBooksReadByYear(userId, year)
   - getBooksReadByMonth(userId, year, month)   // month: 1..12
   - getTotalPagesRead(userId, { year, month })
   - getMostReadGenre(userId, { year, month })
   - getUserReadingStats(userId, { year, month })
   Notas: solo cuenta status === "FINISHED" y usa finishedReading dentro del rango.
*/

const buildRange = ({ year, month }) => {
    if (!year && !month) return null;
    const y = year ?? new Date().getFullYear();
    if (month) {
        const start = new Date(y, month - 1, 1);
        const end = new Date(y, month, 1);
        return { start, end };
    };

    const start = new Date(y, 0, 1);
    const end = new Date(y + 1, 0, 1);
    return { start, end };
};

const getUserShelfIds = async (userId) => {
    const shelves = await Shelf.find({ userId }).select("_id");
    return shelves.map(s => s._id);
};

// LIBROS LEÍDOS EN 1 AÑO:
export const getBooksReadByYear = async (userId, year) => {
    const shelfIds = await getUserShelfIds(userId);
    if (shelfIds.length === 0) return 0;
    const range = buildRange({ year });

    return Reading.countDocuments({
        shelfId: { $in: shelfIds },
        status: "FINISHED",
        finishedReading: { $gte: range.start, $lt: range.end }
    });
};

// LIBROS LEÍDOS EN TAL MES
export const getBooksReadByMonth = async (userId, year, month) => {
    const shelfIds = await getUserShelfIds(userId);
    if (shelfIds.length === 0) return 0;
    const range = buildRange({ year, month });

    return Reading.countDocuments({
        shelfId: { $in: shelfIds },
        status: "FINISHED",
        finishedReading: { $gte: range.start, $lt: range.end }
    });
};

// PÁGINAS LEÍDAS (sumamos pageCount):
export const getTotalPagesRead = async (userId, { year, month } = {}) => {
    const shelfIds = await getUserShelfIds(userId);
    if (shelfIds.length === 0) return 0;
    const range = buildRange({ year, month });

    const rows = await Reading.aggregate([
        {
            $match: {
                shelfId: { $in: shelfIds },
                status: "FINISHED",
                ...(range ? { finishedReading: { $gte: range.start, $lt: range.end } } : {})
            }
        },
        { $group: { _id: null, total: { $sum: "$pageCount" } } }
    ]);

    return rows?.[0]?.total ?? 0;
};

// Género más leído (por cantidad de libros)
export const getMostReadGenre = async (userId, { year, month } = {}) => {
    const shelfIds = await getUserShelfIds(userId);
    if (shelfIds.length === 0) return null;
    const range = buildRange({ year, month });

    const rows = await Reading.aggregate([
        {
            $match: {
                shelfId: { $in: shelfIds },
                status: "FINISHED",
                ...(range ? { finishedReading: { $gte: range.start, $lt: range.end } } : {})
            }
        },
        {
            $lookup: {
                from: Book.collection.name,
                localField: "bookId",
                foreignField: "_id",
                as: "book"
            }
        },
        { $unwind: "$book" },
        { $group: { _id: "$book.genre", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    if (!rows.length) return null;
    return { genre: rows[0]._id, count: rows[0].count };
};

// Wrapper de estadísticas
export const getUserReadingStats = async (userId, { year, month } = {}) => {
    const [booksYear, booksMonth, totalPages, topGenre] = await Promise.all([
        year ? getBooksReadByYear(userId, year) : null,
        year && month ? getBooksReadByMonth(userId, year, month) : null,
        getTotalPagesRead(userId, { year, month }),
        getMostReadGenre(userId, { year, month })
    ]);

    return {
        booksReadYear: booksYear,
        booksReadMonth: booksMonth,
        totalPagesRead: totalPages,
        mostReadGenre: topGenre
    };
};