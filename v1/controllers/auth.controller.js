import { loginService, registerService } from '../services/auth.service.js';

export const AuthController = {
	login: async (req, res) => {
		try {
			const { token, membership, maxReadings, role, avatarUrl } = await loginService(req.body);
			return res.status(200).json({
				data: { token, membership, maxReadings, role, avatarUrl },
				message: 'Usuario iniciado sesión correctamente',
			});
		} catch (error) {
			const status = error.status || 500;
			return res.status(status).json({
				message: 'Error al iniciar sesión',
				error: error.message
			});
		}
	},

	register: async (req, res) => {
		try {
			const { token, membership, role, maxReadings, avatarUrl } = await registerService(req.body);
			return res.status(201).json({
				data: { token, membership, maxReadings, role, avatarUrl },
				message: 'Usuario registrado correctamente',
			});
		} catch (error) {
			const status = error.status || 500;
			return res.status(status).json({
				message: 'Error al registrar usuario',
				error: error.message
			});
		}
	},
};