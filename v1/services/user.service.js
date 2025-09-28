import User from "../models/user.model.js";

export const UserService = {
    getUserById: async (id) => {
        const user = await User.findById(id).populate('shelf').populate('membership');
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
        
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
            throw new Error('Usuario no encontrado');
        }
        return updatedUser;
},

    deleteUser: async (id) => {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            throw new Error('Usuario no encontrado');
        }
        return { message: "Usuario eliminado OK", deleted };
}
}