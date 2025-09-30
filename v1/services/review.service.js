import Review from "../models/review.model.js";
import Reading from "../models/reading.model.js";
import { setReadingDateMiddleware } from "../middlewares/setReadingDate.middleware.js";

export const validateStatusIsOk = async (readingId) => {
    // Valida que exista la Reading
    let reading;
    try {
        reading = await Reading.findById(readingId);
    } catch {
        const err = new Error('ID de lectura inválido');
        err.status = 400;
        throw err;
    };

    if (!reading) {
        const err = new Error('No se encontró la lectura asociada');
        err.status = 404;
        throw err;
    };

    // Valida que su status sea FINISHED
    if (reading.status !== 'FINISHED') {
        const err = new Error('Solo se pueden hacer reseñas de lecturas finalizadas');
        err.status = 409;
        throw err;
    };

    return reading;
};

export const createReviewService = async (reviewData) => {
    const { reading: readingId, userId } = reviewData;
    await validateStatusIsOk(readingId);

    //Evitar duplicados: una review por usuario y Reading
    const duplicado = await Review.findOne({ reading: readingId, userId });
    if (duplicado) {
        const err = new Error('Ya hiciste una reseña para esta lectura');
        err.status = 409;
        throw err;
    };

    // Crear la review
    try {
        const newReview = new Review(reviewData);
        await newReview.save();
        return await Review.findById(newReview._id)
            .populate('userId')
            .populate({ path: 'reading', populate: [{ path: 'bookId' }, { path: 'shelfId' }] });
    } catch (error) {
        let err = new Error('Error al agregar la reseña');
        err.status = 500;
        throw err;
    };
};

export const getAllReviewsService = async () => {
    return await Review.find()
        .populate('userId')
        .populate({ path: 'reading', populate: [{ path: 'bookId' }, { path: 'shelfId' }] });
};

export const getReviewByIdService = async (id) => {
    let review;
    try {
        review = await Review.findById(id)
            .populate('userId')
            .populate({ path: 'reading', populate: [{ path: 'bookId' }, { path: 'shelfId' }] });
    } catch (error) {
        let err = new Error('Error al encontrar la reseña');
        err.status = 400;
        throw err;
    };

    if (!review) {
        let err = new Error('No se encontró la reseña');
        err.status = 404;
        throw err;
    };

    return review;
};

export const updateDatesOfReview = async (reviewId) => {
    const review = await Review.findById(reviewId).populate('reading');
    if (!review) {
        const err = new Error('No se encontró la reseña');
        err.status = 404;
        throw err;
    };

    const reading = await validateStatusIsOk(review.reading._id || review.reading);

    // Sincronizar las fechas en Reading y las guarda
    setReadingDateMiddleware(reading);
    await reading.save();

    // Guardar la fecha de actualización en Review
    review.updatedAt = new Date();
    await review.save();

    return await Review.findById(reviewId)
        .populate('userId')
        .populate({ path: 'reading', populate: [{ path: 'bookId' }, { path: 'shelfId' }] });
};

export const deleteReviewByIdService = async (id) => {
    let deletedReview;
    try {
        deletedReview = await Review.findByIdAndDelete(id);
    } catch (error) {
        let err = new Error('Error al eliminar la reseña');
        err.status = 400;
        throw err;
    };

    if (!deletedReview) {
        let err = new Error('No se encontró la reseña a eliminar');
        err.status = 404;
        throw err;
    };

    return deletedReview;
};