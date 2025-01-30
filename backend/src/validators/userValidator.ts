import Joi from 'joi';

/**
 * Validator for user registration.
 * Validates data when creating a new user.
 */
export const registerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le prénom est requis',
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le nom est requis',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'string.empty': 'Email requis'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'string.empty': 'Mot de passe requis'
    }),
  roles: Joi.array()
    .items(Joi.string().valid('ROLE_CLIENT', 'ROLE_ADMIN'))
    .default(['ROLE_CLIENT'])
    .messages({
      'array.base': 'Les rôles doivent être un tableau',
      'any.only': 'Rôles invalides'
    })
});

/**
 * Validator for user login.
 * Validates data for user authentication.
 */
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'string.empty': 'Email requis'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Mot de passe requis'
    })
});

/**
 * Validator for updating user details.
 * Validates data when updating user information.
 */
export const updateUserSchema = Joi.object({
  first_name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
  last_name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
  bio: Joi.string()
    .max(500)
    .messages({
      'string.max': 'La bio ne peut pas dépasser 500 caractères'
    }),
  location: Joi.string()
    .max(100)
    .messages({
      'string.max': 'La localisation ne peut pas dépasser 100 caractères'
    })
}).min(1);

/**
 * Validator for filtering users.
 * Validates data when querying users.
 */
export const filterUserSchema = Joi.object({
  role: Joi.string()
    .valid("ROLE_ADMIN", "ROLE_EMPLOYE", "ROLE_CLIENT")
    .messages({
      "any.only": "role must be one of [ROLE_ADMIN, ROLE_EMPLOYE, ROLE_CLIENT].",
    }),
  email: Joi.string()
    .email()
    .messages({
      "string.email": "email must be a valid email address.",
    }),
}).or("role", "email"); // At least one filter must be provided

/**
 * Validator for updating user permissions.
 * Validates data when managing user permissions.
 */
export const updateUserPermissionsSchema = Joi.object({
  permissions: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      "array.base": "permissions must be an array of strings.",
      "any.required": "permissions is required.",
    }),
});

/**
 * Validator for updating current user profile
 */
export const updateCurrentUserSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
  bio: Joi.string()
    .max(500)
    .messages({
      'string.max': 'La bio ne peut pas dépasser 500 caractères'
    }),
  birthDate: Joi.date()
    .iso()
    .messages({
      'date.base': 'La date de naissance doit être une date valide'
    }),
  gender: Joi.string()
    .valid('male', 'female', 'other')
    .messages({
      'any.only': 'Le genre doit être male, female ou other'
    }),
  preferences: Joi.object({
    gender: Joi.string()
      .valid('male', 'female', 'both')
      .messages({
        'any.only': 'La préférence de genre doit être male, female ou both'
      }),
    ageRange: Joi.object({
      min: Joi.number()
        .min(18)
        .max(100)
        .messages({
          'number.min': "L'âge minimum doit être d'au moins 18 ans",
          'number.max': "L'âge maximum ne peut pas dépasser 100 ans"
        }),
      max: Joi.number()
        .min(18)
        .max(100)
        .messages({
          'number.min': "L'âge minimum doit être d'au moins 18 ans",
          'number.max': "L'âge maximum ne peut pas dépasser 100 ans"
        })
    })
  })
});

/**
 * Validator for updating user photos
 */
export const updatePhotosSchema = Joi.object({
  pictures: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .max(5)
    .required()
    .messages({
      'array.min': 'Au moins une photo est requise',
      'array.max': 'Maximum 5 photos autorisées',
      'string.uri': 'URL de photo invalide'
    })
});
