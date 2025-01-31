import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
    "string.email": "Email invalide",
    "any.required": "Email requis",
    "string.empty": "Email requis",
  }),
  password: Joi.string()
    .required()
    .messages({
    "any.required": "Mot de passe requis",
    "string.empty": "Mot de passe requis",
  }),
});
