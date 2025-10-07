import Joi from "joi";

export const addShelfSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Nombre no puede estar vacío.",
        "any.required": "El Nombre es obligatorio."
    })
});

export const updateShelfSchema = Joi.object({
    name: Joi.string(),
    readings: Joi.array().items(Joi.string()).messages({
        "array.base": "Debe ser una lista."
    })
}).min(1); // al menos un campo debe estar presente
