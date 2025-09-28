import Review from "../models/review.model.js";

/* FALTAN:
    validateStatusIsOk():
        - validar que el status sea válido para crear una review (finished)
        - retornar el status

    createReview(): 
        - llamar a validateStatusIsOk()
        - crear la review
        - retornar la review

    updateDatesOfReview(): 
        - validar que el status sea válido (finished)
        - actualizar las fechas de la review usando el middleware setReadingDateMiddleware
        - retornar la review
)
*/

export const createReviewService = async (reviewData) => {
    try {
        const newReview = new Review(reviewData);
        await newReview.save();
        return newReview;
    } catch (error) {
        let err = new Error('Error al agregar la reseña');
        err.status = 500;
        throw err;
    };
};

export const getAllReviewsService = async () => {
    return await Review.find().populate('userId').populate('bookId');
};

export const getReviewByIdService = async (id) => {
    let review;
    try {
        review = await Review.findById(id).populate('userId').populate('bookId');
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
        let err = new Error('No se encontró la reseña para eliminar');
        err.status = 404;
        throw err;
    };

    return deletedReview;
};