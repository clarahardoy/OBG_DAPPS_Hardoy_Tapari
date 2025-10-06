import Joi from "joi";

export const addShelfSchema = Joi.object({
    userId: Joi.string().required().messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Usuario no puede estar vacío.",
        "any.required": "El Usuario es obligatorio."
    }),
    name: Joi.string().required().messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Nombre no puede estar vacío.",
        "any.required": "El Nombre es obligatorio."
    }),
    readings: Joi.array().items(Joi.string()).required().messages({
        "array.base": "Debe ser una lista.",
        "any.required": "La lista de Lecturas es obligatoria."
    }),
    createdAt: Joi.date().optional().messages({
        "date.base": "Debe ser una fecha válida."
    }),
    updatedAt: Joi.date().optional().messages({
        "date.base": "Debe ser una fecha válida."
    }),
});

export const updateShelfSchema = Joi.object({
    name: Joi.string(),
    readings: Joi.array().items(Joi.string()).messages({
        "array.base": "Debe ser una lista."
    }),
    createdAt: Joi.date().messages({
        "date.base": "Debe ser una fecha válida."
    }),
    updatedAt: Joi.date().messages({
        "date.base": "Debe ser una fecha válida."
    }),
}).min(1); // al menos un campo debe estar presente
