import Joi from 'joi';

export const createSwipeSchema = Joi.object({
  target_user_id: Joi.string()
    .required()
    .messages({
      'string.empty': "L'identifiant de l'utilisateur cible est requis"
    }),
  direction: Joi.string()
    .valid('right', 'left')
    .required()
    .messages({
      'any.only': 'Le type doit être LIKE ou DISLIKE',
      'any.required': 'Le type de swipe est requis'
    })
});         