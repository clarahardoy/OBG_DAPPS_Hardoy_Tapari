
import { 
    getUserByIdService,
    getUsersService,
    createUserService,
    updateUserService,
    deleteUserService
} from '../services/user.service.js';

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await getUserByIdService(id);
    return res.status(200).json(user);
};

export const getUsers = async (req, res) => {
    const users = await getUsersService();
    return res.status(200).json(users);
};

export const createUser = async (req, res) => {
    const user = await createUserService(req.body);
    return res.status(201).json(user);
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await updateUserService(id, req.body);
    return res.status(200).json(user);
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    await deleteUserService(id);
    return res.status(204).send();
};