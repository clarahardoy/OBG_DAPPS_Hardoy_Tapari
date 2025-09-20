export const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({ error: "No se encontró el recurso" })
    next();
}