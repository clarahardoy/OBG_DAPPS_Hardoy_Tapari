import Joi from "joi";

export const loginValidator = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
}

export const registerValidator = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.ref('password'),
    name: Joi.string().min(2).max(30),
    surname: Joi.string().min(2).max(30),
    role: Joi.string().valid('admin', 'user'),
} 