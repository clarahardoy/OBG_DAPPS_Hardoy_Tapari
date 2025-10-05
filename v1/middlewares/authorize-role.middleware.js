export const authorizeRoleMiddleware = (roles = []) => {
    return (req, res, next) => {
        const role = req.role || req.user?.role;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({
                message: "Acceso denegado",
                error: "No tienes permisos para realizar esta acción"
            });
        };
        next();
    };
};