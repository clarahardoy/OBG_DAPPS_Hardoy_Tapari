import Joi from 'joi';

export const createBookSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        'string.empty': 'El título no puede estar vacío',
        'string.min': 'El título debe tener al menos 3 caracteres',
        'any.required': 'El título es obligatorio'
    }),
    author: Joi.string().min(3).required().messages({
        'string.empty': 'El autor no puede estar vacío',
        'string.min': 'El autor debe tener al menos 3 caracteres',
        'any.required': 'El autor es obligatorio'
    }),
    pages: Joi.number().min(1).required().messages({
        'number.base': 'Las páginas deben ser un número',
        'number.min': 'El libro debe tener al menos 1 página',
        'any.required': 'La cantidad de páginas es obligatoria'
    }),
    gener: Joi.string().min(3).required().messages({
        'string.empty': 'El género no puede estar vacío',
        'string.min': 'El género debe tener al menos 3 caracteres',
        'any.required': 'El género es obligatorio'
    }),
    sinopsis: Joi.string().min(10).required().messages({
        'string.empty': 'La sinopsis no puede estar vacía',
        'string.min': 'La sinopsis debe tener al menos 10 caracteres',
        'any.required': 'La sinopsis es obligatoria'
    }),
    eBook: Joi.boolean().required().messages({
        'boolean.base': 'eBook debe ser un valor booleano',
        'any.required': 'El campo eBook es obligatorio'
    }),
    publicationDate: Joi.date().required().messages({
        'date.base': 'La fecha de publicación debe ser una fecha válida',
        'any.required': 'La fecha de publicación es obligatoria'
    })
});