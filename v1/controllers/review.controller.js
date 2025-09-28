import {
    createReviewService,
    getAllReviewsService,
    getReviewByIdService,
    deleteReviewByIdService
} from "../services/review.service.js";

/*ENDPOINTS:
    createReview(readingId, reviewData, userId): 
        - validar que la reading esté terminada (status)
        - validar que no exista una review para esa reading
        - crear la review
        - retornar la review

    getAllReviews(): 
        - obtener todas las reviews
        - retornar las reviews

    getReviewById(id): 
        - obtener la review por id
        - retornar la review

    deleteReviewById(id): 
        - eliminar la review por id
        - retornar la review eliminada
*/

export const createReviewController = async (req, res) => {
    try {
        const reviewData = req.body;
        const newReview = await createReviewService(reviewData);
        res.status(201).json({ message: "Reseña creada con éxito", newReview });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reseña", error: error.message });
    };
};

export const getAllReviewsController = async (req, res) => {
    try {
        const reviews = await getAllReviewsService();
        res.status(200).json({ message: "Reseñas cargadas con éxito", reviews });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las reseñas", error: error.message });
    };
};

export const getReviewByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await getReviewByIdService(id);
        res.status(200).json({ message: "Reseña encotrada con éxito", review });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la reseña", error: error.message });
    }
};

// updateReviewByIdController pending

export const deleteReviewByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await deleteReviewByIdService(id);
        res.status(200).json({ message: "Reseña eliminada con éxito", deletedReview });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la reseña", error: error.message });
    }
};