import { loginService, registerService } from "../services/auth.service.js";

export const AuthController = {
  login: async (req, res) => {
    try {
      const token = await loginService(req.body);
      return res.status(200).json({ token, message: "Usuario iniciado sesión correctamente" });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ message: "Error al iniciar sesión", error: error.message });
    }
  },

  register: async (req, res) => {
    try {
      const token = await registerService(req.body);
      return res.status(201).json({ token, message: "Usuario registrado correctamente", token });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ message: "Error al registrar usuario", error: error.message });
    }
  }
}