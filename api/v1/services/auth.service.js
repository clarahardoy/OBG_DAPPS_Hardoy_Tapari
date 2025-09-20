import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const sign = (user) => jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export const registerService = async ({ email, password }) => {
    
    const userExiste = await User.findOne({ email });
    if (userExiste) {
        let error = new Error("No se ha podido registrar el usuario");
        error.status = 409;
        throw error;
    }
    const hashPassword = bcrypt.hashSync(password, 12);
    const user = new User({ email, password: hashPassword });
    await user.save();
    const token = sign(user);
    return token;
}

export const loginService = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        let error = new Error("Credenciales inválidas");
        error.status = 401;
        throw error;
    }
    const token = sign(user);
    return token;
}

