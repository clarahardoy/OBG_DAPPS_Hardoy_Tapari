import User from "../models/user.model.js";

export const getUserByIdService = async (id) => {
    const user = await User.findById(id).populate('shelf').populate('membership');
    return user;
}

export const getUsersService = async () => {
    const users = await User.find().populate('shelf').populate('membership');
    return users;
}

export const createUserService = async (user) => {
    const newUser = await User.create(user);
    return newUser;
}

export const updateUserService = async (id, user) => {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
}

export const deleteUserService = async (id) => {
    const deleted = await User.findByIdAndDelete(id);
    return { message: "Usuario eliminado OK", deleted };
}