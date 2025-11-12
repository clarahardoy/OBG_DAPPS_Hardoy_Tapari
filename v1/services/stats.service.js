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
  const m = Number.isInteger(month) ? month : (now.getMonth() + 1); // 1..12
  return { year: y, month: m };
};

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
  // Opción robusta: sumar desde Book.pages para evitar desvíos si Reading.pageCount está mal
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

    // Fallback: si por algo no hay match con Book, suma lo desnormalizado
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
      { $group: { _id: "$book.genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
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
      { $group: { _id: "$book.genre", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]);

    return rows.map(r => ({ genre: r._id, count: r.count }));
  },

  // WRAPPER
  // Nuevo: si no te pasan year/month, usa los actuales para que NO devuelva null
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