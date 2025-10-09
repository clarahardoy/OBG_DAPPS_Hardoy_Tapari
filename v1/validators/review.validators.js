import Joi from 'joi';

export const addReviewSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'El campo Usuario es obligatorio',
        'string.empty': 'El campo Usuario no puede estar vacío'
    }),
    reading: Joi.string().required().messages({
        'any.required': 'La lectura asociada es obligatoria',
        'string.empty': 'El campo Lectura no puede estar vacío'
    }),
    title: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required().messages({
        'any.required': 'El campo Calificación es obligatorio',
        'number.base': 'El campo Calificación debe ser un número',
        'number.min': 'El campo Calificación debe ser al menos 0',
        'number.max': 'El campo Calificación debe ser como máximo 5'
    }),
    comment: Joi.string().required().messages({
        'any.required': 'El campo Comentario es obligatorio',
        'string.empty': 'El campo Comentario no puede estar vacío'
    })
});