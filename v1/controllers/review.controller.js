import {
    createReviewService,
    getAllReviewsService,
    getReviewByIdService,
    deleteReviewByIdService
} from "../services/review.service.js";

export const createReviewController = async (req, res) => {
    const reviewData = req.body;
    const newReview = await createReviewService(reviewData);
    res.status(201).json(newReview);
};

export const getAllReviewsController = async (req, res) => {
    const reviews = await getAllReviewsService();
    res.status(200).json(reviews);
};

export const getReviewByIdController = async (req, res) => {
    const { id } = req.params;
    const review = await getReviewByIdService(id);
    res.status(200).json(review);
};

export const deleteReviewByIdController = async (req, res) => {
    const { id } = req.params;
    const deletedReview = await deleteReviewByIdService(id);
    res.status(200).json(deletedReview);
};