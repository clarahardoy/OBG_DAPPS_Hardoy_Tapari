import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
  const { username, password } = req.body;
  const user = "cambiarCdoEsteBD";
  // const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Usuario y/o contraseña incorrectos" });
  }
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).json({ message: "Usuario y/o contraseña incorrectos" });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = "cambiarCdoEsteBD";
    // const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Usuario no disponible" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    //usuarios.push({ username, password: hashedPassword });
   
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
   return res.status(200).json({ token, message: "Usuario registrado correctamente", user: username });
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};