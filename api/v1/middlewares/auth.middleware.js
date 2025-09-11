export const authenticate = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(401).json({ message: "Sin headers de autorización", error: "No autorizado" });
  }
  const token = authHeaders.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Sin token", error: "No autorizado" });
  }
 jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) {
    return res.status(403).json({ message: "Token inválido", error: "Acceso denegado" });
  }
  req.user = user.username;
  next();
 });
};