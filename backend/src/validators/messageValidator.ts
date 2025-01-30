import Joi from 'joi';

export const createMessageSchema = Joi.object({
  match_id: Joi.string()
    .required()
    .messages({
      'string.empty': "L'identifiant du match est requis"
    }),
  content: Joi.string()
    .required()
    .min(1)
    .max(1000)
    .messages({
      'string.empty': 'Le contenu du message est requis',
      'string.min': 'Le message ne peut pas être vide',
      'string.max': 'Le message ne peut pas dépasser 1000 caractères'
    })
}); 