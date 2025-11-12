import mongoose from "mongoose";
import { buildRange } from "../utils/build-range.js";
import { ShelfService } from "./shelf.service.js";
import Reading from "../models/reading.model.js";
import Book from "../models/book.model.js";

const toObjectIds = (ids) => ids.map(id => new mongoose.Types.ObjectId(id));
const hasYM = (year, month) => Number.isInteger(year) || Number.isInteger(month);

// Si no vienen, usamos año/mes actuales
const withDefaults = (year, month) => {
    const now = new Date();
    const y = Number.isInteger(year) ? year : now.getFullYear();
    const m = Number.isInteger(month) ? month : (now.getMonth() + 1); 
    return { year: y, month: m };
};

const GENERIC_TOKENS = ["General", "Fiction", "Juvenile Fiction", "Nonfiction", "Family", "Family Life"];

export const StatsService = {

    // LIBROS LEÍDOS EN 1 AÑO
    getBooksReadByYear: async (userId, year) => {
        const shelfIds = await ShelfService.getUserShelvesIds(userId);
        if (shelfIds.length === 0) return 0;

        const range = buildRange({ year });
        return Reading.countDocuments({
            shelfId: { $in: toObjectIds(shelfIds) },
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
            shelfId: { $in: toObjectIds(shelfIds) },
            status: "FINISHED",
            finishedReading: { $gte: range.start, $lt: range.end }
        });
    },

    // PÁGINAS LEÍDAS
    getTotalPagesRead: async (userId, { year, month } = {}) => {
        const shelfIds = await ShelfService.getUserShelvesIds(userId);
        if (shelfIds.length === 0) return 0;

        const applyRange = hasYM(year, month);
        const range = applyRange ? buildRange({ year, month }) : null;

        const rows = await Reading.aggregate([
            {
                $match: {
                    shelfId: { $in: toObjectIds(shelfIds) },
                    status: "FINISHED",
                    ...(applyRange ? { finishedReading: { $gte: range.start, $lt: range.end } } : {})
                }
            },
            {
                $lookup: {
                    from: Book.collection.name,
                    localField: "googleBooksId",
                    foreignField: "googleBooksId",
                    as: "book"
                }
            },
            { $unwind: "$book" },
            { $group: { _id: null, total: { $sum: "$book.pages" } } }
        ]);

        if (!rows?.[0]?.total) {
            const rows2 = await Reading.aggregate([
                {
                    $match: {
                        shelfId: { $in: toObjectIds(shelfIds) },
                        status: "FINISHED",
                        ...(applyRange ? { finishedReading: { $gte: range.start, $lt: range.end } } : {})
                    }
                },
                { $group: { _id: null, total: { $sum: "$pageCount" } } }
            ]);
            return rows2?.[0]?.total ?? 0;
        }
        return rows[0].total;
    },

    // GÉNERO MÁS LEÍDO
    getMostReadGenre: async (userId, { year, month } = {}) => {
        const shelfIds = await ShelfService.getUserShelvesIds(userId);
        if (shelfIds.length === 0) return null;

        const applyRange = hasYM(year, month);
        const range = applyRange ? buildRange({ year, month }) : null;

        const rows = await Reading.aggregate([
            {
                $match: {
                    shelfId: { $in: toObjectIds(shelfIds) },
                    status: "FINISHED",
                    ...(applyRange ? { finishedReading: { $gte: range.start, $lt: range.end } } : {})
                }
            },
            {
                $lookup: {
                    from: Book.collection.name,
                    localField: "googleBooksId",
                    foreignField: "googleBooksId",
                    as: "book"
                }
            },
            { $unwind: "$book" },

            { $match: { "book.genre": { $exists: true, $ne: null, $ne: "" } } },

            {
                $addFields: {
                    _genres: {
                        $cond: [
                            { $isArray: "$book.genre" },
                            {
                                $filter: {
                                    input: "$book.genre",
                                    as: "g",
                                    cond: { $gt: [{ $strLenCP: { $trim: { input: "$$g" } } }, 0] }
                                }
                            },
                            {
                                $map: {
                                    input: { $split: ["$book.genre", ","] },
                                    as: "g",
                                    in: { $trim: { input: "$$g" } }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    _tokensPerPath: {
                        $map: {
                            input: "$_genres",
                            as: "g",
                            in: {
                                $map: {
                                    input: { $split: ["$$g", "/"] },
                                    as: "t",
                                    in: { $trim: { input: "$$t" } }
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    _filteredPerPath: {
                        $map: {
                            input: "$_tokensPerPath",
                            as: "arr",
                            in: {
                                $filter: {
                                    input: "$$arr",
                                    as: "t",
                                    cond: {
                                        $and: [
                                            { $gt: [{ $strLenCP: "$$t" }, 0] },
                                            { $not: { $in: ["$$t", GENERIC_TOKENS] } }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    _specifics: {
                        $map: {
                            input: "$_filteredPerPath",
                            as: "arr",
                            in: {
                                $cond: [
                                    { $gt: [{ $size: "$$arr" }, 0] },
                                    { $arrayElemAt: ["$$arr", { $subtract: [{ $size: "$$arr" }, 1] }] },
                                    null
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    primaryGenre: {
                        $let: {
                            vars: {
                                nn: {
                                    $filter: { input: "$_specifics", as: "s", cond: { $ne: ["$$s", null] } }
                                }
                            },
                            in: {
                                $cond: [
                                    { $gt: [{ $size: "$$nn" }, 0] },
                                    { $arrayElemAt: ["$$nn", 0] },
                                    null
                                ]
                            }
                        }
                    }
                }
            },

            { $match: { primaryGenre: { $exists: true, $ne: null, $ne: "" } } },
            { $group: { _id: "$primaryGenre", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 1 }
        ]);

        if (!rows.length) return null;
        return { genre: rows[0]._id, count: rows[0].count };
    },

    // LIBROS POR GÉNERO
    getBooksCountByGenre: async (userId, { year, month } = {}) => {
        const shelfIds = await ShelfService.getUserShelvesIds(userId);
        if (shelfIds.length === 0) return [];

        const applyRange = hasYM(year, month);
        const range = applyRange ? buildRange({ year, month }) : null;

        const rows = await Reading.aggregate([
            {
                $match: {
                    shelfId: { $in: toObjectIds(shelfIds) },
                    status: "FINISHED",
                    ...(applyRange ? { finishedReading: { $gte: range.start, $lt: range.end } } : {})
                }
            },
            {
                $lookup: {
                    from: Book.collection.name,
                    localField: "googleBooksId",
                    foreignField: "googleBooksId",
                    as: "book"
                }
            },
            { $unwind: "$book" },
            { $match: { "book.genre": { $exists: true, $ne: null, $ne: "" } } },

            {
                $addFields: {
                    _genres: {
                        $cond: [
                            { $isArray: "$book.genre" },
                            {
                                $filter: {
                                    input: "$book.genre",
                                    as: "g",
                                    cond: { $gt: [{ $strLenCP: { $trim: { input: "$$g" } } }, 0] }
                                }
                            },
                            {
                                $map: {
                                    input: { $split: ["$book.genre", ","] },
                                    as: "g",
                                    in: { $trim: { input: "$$g" } }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    _tokensPerPath: {
                        $map: {
                            input: "$_genres",
                            as: "g",
                            in: {
                                $map: {
                                    input: { $split: ["$$g", "/"] },
                                    as: "t",
                                    in: { $trim: { input: "$$t" } }
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    _filteredPerPath: {
                        $map: {
                            input: "$_tokensPerPath",
                            as: "arr",
                            in: {
                                $filter: {
                                    input: "$$arr",
                                    as: "t",
                                    cond: {
                                        $and: [
                                            { $gt: [{ $strLenCP: "$$t" }, 0] },
                                            { $not: { $in: ["$$t", GENERIC_TOKENS] } }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    _specifics: {
                        $map: {
                            input: "$_filteredPerPath",
                            as: "arr",
                            in: {
                                $cond: [
                                    { $gt: [{ $size: "$$arr" }, 0] },
                                    { $arrayElemAt: ["$$arr", { $subtract: [{ $size: "$$arr" }, 1] }] },
                                    null
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    primaryGenre: {
                        $let: {
                            vars: {
                                nn: {
                                    $filter: { input: "$_specifics", as: "s", cond: { $ne: ["$$s", null] } }
                                }
                            },
                            in: {
                                $cond: [
                                    { $gt: [{ $size: "$$nn" }, 0] },
                                    { $arrayElemAt: ["$$nn", 0] },
                                    null
                                ]
                            }
                        }
                    }
                }
            },

            { $match: { primaryGenre: { $exists: true, $ne: null, $ne: "" } } },
            { $group: { _id: "$primaryGenre", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
        ]);

        return rows.map(r => ({ genre: r._id, count: r.count }));
    },

    // WRAPPER
    getUserReadingStats: async (userId, { year, month } = {}) => {
        const { year: y, month: m } = withDefaults(year, month);

        const [booksYear, booksMonth, totalPages, topGenre, booksByGenre] = await Promise.all([
            StatsService.getBooksReadByYear(userId, y),
            StatsService.getBooksReadByMonth(userId, y, m),
            StatsService.getTotalPagesRead(userId, { year: y, month: m }),
            StatsService.getMostReadGenre(userId, { year: y, month: m }),
            StatsService.getBooksCountByGenre(userId, { year: y, month: m })
        ]);

        return {
            booksReadYear: booksYear,
            booksReadMonth: booksMonth,
            totalPagesRead: totalPages,
            mostReadGenre: topGenre,
            booksByGenre
        };
    }
};
