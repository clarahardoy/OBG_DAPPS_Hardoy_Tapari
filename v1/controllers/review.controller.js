import {
    createReviewService,
    getAllReviewsService,
    getReviewByIdService,
    deleteReviewByIdService
} from "../services/review.service.js";

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

export const deleteReviewByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await deleteReviewByIdService(id);
        res.status(200).json({ message: "Reseña eliminada con éxito", deletedReview });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la reseña", error: error.message });
    }
};