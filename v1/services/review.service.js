import Review from "../models/review.model.js";
import { ReadingService } from "./reading.service.js";
import { setReadingDates } from "../utils/set-reading-date.js";
import { ReadingStatus } from "../models/enums/reading-status.enum.js";

export const ReviewService = {
    validateStatusIsOk: async (readingId) => {
        // Valida que exista la Reading
        const reading = await ReadingService.getReadingById(readingId);
    
        // Valida que su status sea FINISHED
        if (reading.status !== ReadingStatus.FINISHED) {
            const err = new Error('Solo se pueden hacer reseñas de lecturas finalizadas');
            err.status = 409;
            throw err;
        };
    
        return reading;
    },
    
    createReview: async (reviewData) => {
        const { reading: readingId, userId } = reviewData;
        await ReviewService.validateStatusIsOk(readingId);
    
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
    },
    
    getAllReviews: async () => {
        return await Review.find()
            .populate('userId')
            .populate({ path: 'reading', populate: [{ path: 'bookId' }, { path: 'shelfId' }] });
    },
    
    getReviewById: async (id) => {
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
    },
    
    updateDatesOfReview: async (reviewId) => {
        const {review, reading} = await ReviewService.getReviewById(reviewId);
    
       await ReviewService.validateStatusIsOk(reading._id || reading);
    
        // Sincronizar las fechas en Reading y las guarda
        setReadingDates(reading);
        await ReadingService.updateReadingById(reading._id, reading);
    
        // Guardar la fecha de actualización en Review
        review.updatedAt = new Date();
        await review.save();
    
        return await ReviewService.getReviewById(reviewId)
     },
    
    deleteReviewById: async (id) => {
        const deletedReview = await ReviewService.getReviewById(id);
        await Review.findByIdAndDelete(id);
        if (!deletedReview) {
            const err = new Error('No se encontró la reseña a eliminar');
            err.status = 404;
            throw err;
        };
        return deletedReview;
        },
}


