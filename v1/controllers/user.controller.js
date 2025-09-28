import {  UserService } from '../services/user.service.js';

export const UserController = {

    getUserById: async (req, res) => {
        const { id } = req.params;
        try {
        const user = await UserService.getUserById(id);
        return res.status(200).json({ message: "Usuario encontrado con éxito", user });
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await UserService.getUsers();
            return res.status(200).json({ message: "Usuarios cargados con éxito", users });
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
        }
    },

    createUser: async (req, res) => {
        try {
            const user = await UserService.createUser(req.body);
            return res.status(201).json({ message: "Usuario creado con éxito", user });
        } catch (error) {
            return res.status(500).json({ message: "Error al crear el usuario", error: error.message });
        }
    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await UserService.updateUser(id, req.body);
            return res.status(200).json({ message: "Usuario actualizado con éxito", user });
        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            await UserService.deleteUser(id);
            return res.status(200).json({ message: "Usuario eliminado con éxito" });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
        }
    },
}
