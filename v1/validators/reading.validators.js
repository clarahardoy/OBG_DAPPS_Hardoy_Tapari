import Joi from "joi";

export const addReadingSchema = Joi.object({
    shelfId: Joi.string().required().messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Estante no puede estar vacío.",
        "any.required": "El Estante es obligatorio."
    }),
    googleBooksId: Joi.string().required().messages({
        "string.base": "Debe ser un texto.",
        "string.empty": "El campo de Libro no puede estar vacío.",
        "any.required": "El Libro es obligatorio."
    }),
    status: Joi.string()
        .valid('FINISHED', 'ABANDONED', 'CURRENTLY_READING', 'WANT_TO_READ')
        .required()
        .messages({
            "string.base": "Debe ser un texto.",
            "string.empty": "El campo de Estado no puede estar vacío.",
            "any.only": "El estado debe ser FINISHED, ABANDONED, CURRENTLY_READING o WANT_TO_READ.",
            "any.required": "El Estado es obligatorio."
        }),
    startedReading: Joi.date().optional().messages({
        "date.base": "Debe ser una fecha válida.",
    }),
    finishedReading: Joi.date().optional().messages({
        "date.base": "Debe ser una fecha válida."
    }),
    pageCount: Joi.number().min(1).required().messages({
        "number.base": "Debe ser un número.",
        "number.min": "El conteo de páginas debe ser al menos 1.",
        "any.required": "El Conteo de Páginas es obligatorio."
    }),
    currentPage: Joi.number().min(0).optional().messages({
        "number.base": "Debe ser un número.",
        "number.min": "La página actual no puede ser negativa."
    }),
})
    // regla condicional: si vienen ambos, currentPage <= pageCount
    .custom((value, helpers) => {
        if (value.currentPage !== undefined && value.pageCount !== undefined) {
            if (value.currentPage > value.pageCount) {
                return helpers.error("any.invalid");
            }
        }
        return value;
    }, "currentPage <= pageCount")
    .messages({
        "any.invalid": "La página actual no puede superar el total de páginas."
    });

export const updateReadingSchema = Joi.object({
    status: Joi.string().valid('FINISHED', 'ABANDONED', 'CURRENTLY_READING', 'WANT_TO_READ'),
    currentPage: Joi.number().min(0).optional()
});