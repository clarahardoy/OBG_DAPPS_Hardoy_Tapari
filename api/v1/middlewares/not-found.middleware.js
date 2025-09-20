export const notFoundMiddleware = (req, res, next) => {
    return res.status(404).json({ error: "Endpoint no encontrado" })
}