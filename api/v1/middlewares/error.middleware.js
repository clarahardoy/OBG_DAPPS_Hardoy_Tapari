export const errorMiddleware = (err, req, res, next) => {
    return res.status(err.status || 500).json({error:err.message || "Error interno del servidor"});
  }