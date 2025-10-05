export const authorizeRoleMiddleware = (roles = []) => {
    return (req, res, next) => {
        // Tomamos el rol desde donde lo dejó authenticate:
        const role = req.role || (req.user && req.user.role);
        if (!role) {
            // Si no hay rol en contexto, no podemos autorizar.
            return res.status(403).json({
                message: "Acceso denegado",
                error: "Rol no disponible en la request"
            });
        };
        if (!roles.includes(req.role)) {
            return res.status(403).json({
                message: "Acceso denegado",
                error: "No tienes permisos para realizar esta acción"
            });
        }
        next();
    };
};