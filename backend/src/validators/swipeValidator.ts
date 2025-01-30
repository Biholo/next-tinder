import Joi from 'joi';

export const createSwipeSchema = Joi.object({
  target_user_id: Joi.string()
    .required()
    .messages({
      'string.empty': "L'identifiant de l'utilisateur cible est requis"
    }),
  type: Joi.string()
    .valid('LIKE', 'DISLIKE')
    .required()
    .messages({
      'any.only': 'Le type doit être LIKE ou DISLIKE',
      'any.required': 'Le type de swipe est requis'
    })
});         