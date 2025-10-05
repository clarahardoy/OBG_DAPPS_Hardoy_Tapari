import jwt from 'jsonwebtoken';
import User  from '../models/user.model.js'; // ajusta el path si aplica

export const authenticateMiddleware = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(401).json({
      message: "Sin headers de autorización",
      error: "No autorizado"
    });
  };

  const token = authHeaders.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Sin token",
      error: "No autorizado"
    });
  };

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Token inválido",
        error: "Acceso denegado"
      });
    };

    // El token actual solo trae { id }. Si no está, es inválido.
    const userId = payload && payload.id;
    if (!userId) {
      return res.status(403).json({
        message: "Token inválido",
        error: "Falta id en el token"
      });
    };

    // Enriquecemos la request consultando a la BD (sin cambiar el token):
    // cargamos email y role para que otras capas (Stats, authorize) funcionen.
    User.findById(userId).select('_id email role name surname')
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            message: "Usuario no encontrado",
            error: "No autorizado"
          });
        };

        // Compatibilidad con el código existente:
        req.user = user;
        req.userId = String(user._id);
        req.email = user.email;
        req.role = user.role;
        res.locals.authUser = { id: req.userId, email: req.email, role: req.role };
        next();
      })
      .catch((dbErr) => {
        return res.status(500).json({
          message: "Error autenticando usuario",
          error: dbErr.message
        });
      });
  });
};