import { ReviewService } from "../services/review.service.js";

export const ReviewController = {
    createReview: async (req, res) => {
        try {
            const reviewData = req.body;
            console.log(reviewData);
            const newReview = await ReviewService.createReview(reviewData);
            res.status(201).json({ message: "Reseña creada con éxito", newReview });
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ message: "Error al crear la reseña", error: error.message });
        };
    },

    getAllReviews: async (req, res) => {
        try {
            const reviews = await ReviewService.getAllReviews();
            res.status(200).json({ message: "Reseñas cargadas con éxito", reviews });
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ message: "Error al obtener las reseñas", error: error.message });
        };
    },

    getReviewById: async (req, res) => {
        try {
            const { id } = req.params;
            const review = await ReviewService.getReviewById(id);
            res.status(200).json({ message: "Reseña encotrada con éxito", review });
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ message: "Error al obtener la reseña", error: error.message });
        }
    },

    updateDatesOfReview: async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await ReviewService.updateDatesOfReview(id);
            res.status(200).json({ message: "Fechas sincronizadas con éxito", review: updated });
        } catch (error) {
            res.status(error.status || 500).json({ message: "Error al sincronizar fechas", error: error.message });
        };
    },

    deleteReviewById: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedReview = await ReviewService.deleteReviewById(id);
            res.status(200).json({ message: "Reseña eliminada con éxito", deletedReview });
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ message: "Error al eliminar la reseña", error: error.message });
        }
    }
}








