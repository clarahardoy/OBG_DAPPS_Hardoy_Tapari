import User from "../models/user.model.js";
import { ShelfService } from "./shelf.service.js";

export const UserService = {
    getUserById: async (id) => {
        try {
            const user = await User.findById(id)
                .populate('membership')
                .select('-password');
            
            if (!user) {
                const error = new Error('Usuario no encontrado');
                error.status = 404;
                throw error;
            }
            return user;
        } catch (error) {
            error.status = error.status || 500;
            throw error;
        }
    },

    getUsers: async () => {
        try {
            const users = await User.find()
                .populate('membership')
                .select('-password');
            
            return users;
        } catch (error) {
            error.status = 500;
            throw error;
        }
    },

    getUsers: async () => {
        const users = await User.find().populate('shelf').populate('membership');
        if (!users) {
            throw new Error('Usuarios no encontrados');
        }
        return users;
    },

    updateUser: async (id, user) => {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        if (!updatedUser) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            throw error;
        }
        return updatedUser;
    },

    deleteUser: async (id) => {
        try {
            const shelves = await ShelfService.getUserShelves(id);
            
            await Promise.all(shelves.map(shelf => 
                ShelfService.deleteShelf(shelf._id)
            ));

            const deleted = await User.findByIdAndDelete(id);
            if (!deleted) {
                const error = new Error('Usuario no encontrado');
                error.status = 404;
                throw error;
            }

            return { message: "Usuario y datos relacionados eliminados con éxito" };
        } catch (error) {
            error.status = error.status || 500;
            throw error;
        }
    },
};