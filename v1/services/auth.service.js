import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { sign } from "../utils/sign.utils.js";
import { MembershipType } from "../models/enums/membership-type.enum.js";

export const registerService = async ({ email, password, name, surname, role, membership }) => {
    const userExiste = await User.findOne({ email });
    if (userExiste) {
        let error = new Error("No se ha podido registrar el usuario");
        error.status = 409;
        throw error;
    }
    const hashPassword = bcrypt.hashSync(password, 12);
    const user = new User({ email, password: hashPassword, name, surname, role, membership: MembershipType.BASIC });
    await user.save();
    const token = sign(user);
    return token;
};

export const loginService = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        let error = new Error("Credenciales inválidas");
        error.status = 401;
        throw error;
    }
    const token = sign(user);
    return token;
};