import mongoose from "mongoose";

export const validateObjectIdMiddleware = (req, res, next) => {
    const { id } = req.params;
    const idValido = mongoose.isValidObjectId(id)
    if (!idValido) {
        let err = new Error("ID inválido");
        err.status = 400;
        throw err;
    }
    next();
}