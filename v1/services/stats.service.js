/* ======================= ESTADÍSTICAS ======================= */
/*
   - getBooksReadByYear(userId, year)
   - getBooksReadByMonth(userId, year, month)   // month: 1..12
   - getTotalPagesRead(userId, { year, month })
   - getMostReadGenre(userId, { year, month })
   - getUserReadingStats(userId, { year, month })
   Notas: solo cuenta status === "FINISHED" y usa finishedReading dentro del rango.
*/
import { buildRange } from "../utils/build-range.js";
import { ShelfService } from "./shelf.service.js";
import Reading from "../models/reading.model.js";
import Book from "../models/book.model.js";

export const StatsService = {

    // LIBROS LEÍDOS EN 1 AÑO:
    getBooksReadByYear: async (userId, year) => {
        const shelfIds = await ShelfService.getUserShelvesIds(userId);

        if (shelfIds.length === 0) return 0;
        const range = buildRange({ year });

        return Reading.countDocuments({
            shelfId: { $in: shelfIds },
            status: "FINISHED",
            finishedReading: { $gte: range.start, $lt: range.end }
        });
    },

    // LIBROS LEÍDOS EN TAL MES
    getBooksReadByMonth: async (userId, year, month) => {
        const shelfIds = await ShelfService.getUserShelvesIds(userId);

        if (shelfIds.length === 0) return 0;
        const range = buildRange({ year, month });

        return Reading.countDocuments({
            shelfId: { $in: shelfIds },
            status: "FINISHED",
            finishedReading: { $gte: range.start, $lt: range.end }
        });
    },

    // PÁGINAS LEÍDAS (sumamos pageCount):
    getTotalPagesRead: async (userId, { year, month } = {}) => {
        const shelfIds = await ShelfService.getUserShelvesIds(userId);

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
    },

    // Género más leído (por cantidad de libros)
    getMostReadGenre: async (userId, { year, month } = {}) => {
        const shelfIds = await ShelfService.getUserShelvesIds(userId);

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
    },

    // Wrapper de estadísticas
    getUserReadingStats: async (userId, { year, month } = {}) => {
        const [booksYear, booksMonth, totalPages, topGenre] = await Promise.all([
            year ? StatsService.getBooksReadByYear(userId, year) : null,
            year && month ? StatsService.getBooksReadByMonth(userId, year, month) : null,
            StatsService.getTotalPagesRead(userId, { year, month }),
            StatsService.getMostReadGenre(userId, { year, month })
        ]);

        return {
            booksReadYear: booksYear,
            booksReadMonth: booksMonth,
            totalPagesRead: totalPages,
            mostReadGenre: topGenre
        };
    }
}



