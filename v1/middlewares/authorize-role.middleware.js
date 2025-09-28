export const authorizeRoleMiddleware = (roles = []) => {
return (req, res, next) => {
    if (!roles.includes(req.role)) {
        return res.status(403).json({ message: "Acceso denegado", error: "No tienes permisos para realizar esta acción" });
    }
    next();
    }
};