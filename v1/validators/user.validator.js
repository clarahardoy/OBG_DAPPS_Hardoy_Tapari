import Joi from "joi";

export const addUserSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Debe ser un texto."
  }),
  surname: Joi.string().optional().messages({
    "string.base": "Debe ser un texto."
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Debe ser un texto.",
    "string.email": "Debe ser un email válido.",
    "string.empty": "El campo de Email no puede estar vacío.",
    "any.required": "El Email es obligatorio."
  }),
  password: Joi.string().required().messages({
    "string.base": "Debe ser un texto.",
    "string.empty": "El campo de Contraseña no puede estar vacío.",
    "any.required": "La Contraseña es obligatoria."
  }),
  membership: Joi.string().optional().messages({
    "string.base": "Debe ser un texto."
  }),
  shelf: Joi.string().optional().messages({
    "string.base": "Debe ser un texto."
  }),
  role: Joi.string().valid('admin', 'user').optional().messages({
    "string.base": "Debe ser un texto.",
    "any.only": "El rol debe ser admin o user."
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "Debe ser un texto."
  }),
  surname: Joi.string().messages({
    "string.base": "Debe ser un texto."
  }),
  email: Joi.string().email().messages({
    "string.base": "Debe ser un texto.",
    "string.email": "Debe ser un email válido."
  }),
  password: Joi.string().messages({
    "string.base": "Debe ser un texto."
  }),
  membership: Joi.string().messages({
    "string.base": "Debe ser un texto."
  }),
  role: Joi.string().valid('admin', 'user').messages({
    "string.base": "Debe ser un texto.",
    "any.only": "El rol debe ser admin o user."
  }),
}).min(1); // al menos un campo debe estar presente
