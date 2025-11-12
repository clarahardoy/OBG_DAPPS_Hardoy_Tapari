import Joi from "joi";

export const loginValidator = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Email no puede estar vacío.",
        "string.email": "Debe ser un email válido.",
        "any.required": "El Email es obligatorio."
    }),
    password: Joi.string().required().messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Contraseña no puede estar vacío.",
        "any.required": "La Contraseña es obligatoria."
    }),
});

export const registerValidator = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Email no puede estar vacío.",
        "string.email": "Debe ser un email válido.",
        "any.required": "El Email es obligatorio."
    }),
    password: Joi.string().required().messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Contraseña no puede estar vacío.",
        "any.required": "La Contraseña es obligatoria."
    }),
    confirmPassword: Joi.ref('password'),
    name: Joi.string().min(2).max(30).messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Nombre no puede estar vacío.",
        "string.min": "El Nombre debe tener al menos 2 caracteres.",
        "string.max": "El Nombre no puede superar los 30 caracteres."
    }),
    surname: Joi.string().min(2).max(30).messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Apellido no puede estar vacío.",
        "string.min": "El Apellido debe tener al menos 2 caracteres.",
        "string.max": "El Apellido no puede superar los 30 caracteres."
    }),
    role: Joi.string().valid('admin', 'user').messages({
        "string.base": "Debe ser un texto.",
        "any.only": "El rol debe ser admin o user."
    }),
    avatarUrl: Joi.string().uri().required().custom((value, helpers) => {
        try {
            const u = new URL(value);
            if (u.hostname !== "res.cloudinary.com") {
                return helpers.error("any.invalid");
            }
            return value;
        } catch { return helpers.error("string.uri"); }
    }).messages({
        "any.invalid": "La URL del avatar debe ser de Cloudinary."
    }),
    avatarPublicId: Joi.string().allow(null, '').messages({
        "string.base": "El publicId debe ser un texto."
    }),
});