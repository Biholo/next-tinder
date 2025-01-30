"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhotosSchema = exports.updateCurrentUserSchema = exports.updateUserPermissionsSchema = exports.filterUserSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    firstName: joi_1.default.string()
        .min(2)
        .max(50)
        .required()
        .messages({
        'string.empty': 'Le prénom est requis',
        'string.min': 'Le prénom doit contenir au moins 2 caractères',
        'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
    lastName: joi_1.default.string()
        .min(2)
        .max(50)
        .required()
        .messages({
        'string.empty': 'Le nom est requis',
        'string.min': 'Le nom doit contenir au moins 2 caractères',
        'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Email invalide',
        'string.empty': 'Email requis'
    }),
    password: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
        'string.empty': 'Mot de passe requis'
    }),
    roles: joi_1.default.array()
        .items(joi_1.default.string().valid('ROLE_CLIENT', 'ROLE_ADMIN'))
        .default(['ROLE_CLIENT'])
        .messages({
        'array.base': 'Les rôles doivent être un tableau',
        'any.only': 'Rôles invalides'
    })
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Email invalide',
        'string.empty': 'Email requis'
    }),
    password: joi_1.default.string()
        .required()
        .messages({
        'string.empty': 'Mot de passe requis'
    })
});
exports.updateUserSchema = joi_1.default.object({
    first_name: joi_1.default.string()
        .min(2)
        .max(50)
        .messages({
        'string.min': 'Le prénom doit contenir au moins 2 caractères',
        'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
    last_name: joi_1.default.string()
        .min(2)
        .max(50)
        .messages({
        'string.min': 'Le nom doit contenir au moins 2 caractères',
        'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
    bio: joi_1.default.string()
        .max(500)
        .messages({
        'string.max': 'La bio ne peut pas dépasser 500 caractères'
    }),
    location: joi_1.default.string()
        .max(100)
        .messages({
        'string.max': 'La localisation ne peut pas dépasser 100 caractères'
    })
}).min(1);
exports.filterUserSchema = joi_1.default.object({
    role: joi_1.default.string()
        .valid("ROLE_ADMIN", "ROLE_EMPLOYE", "ROLE_CLIENT")
        .messages({
        "any.only": "role must be one of [ROLE_ADMIN, ROLE_EMPLOYE, ROLE_CLIENT].",
    }),
    email: joi_1.default.string()
        .email()
        .messages({
        "string.email": "email must be a valid email address.",
    }),
}).or("role", "email");
exports.updateUserPermissionsSchema = joi_1.default.object({
    permissions: joi_1.default.array()
        .items(joi_1.default.string())
        .required()
        .messages({
        "array.base": "permissions must be an array of strings.",
        "any.required": "permissions is required.",
    }),
});
exports.updateCurrentUserSchema = joi_1.default.object({
    firstName: joi_1.default.string()
        .min(2)
        .max(50)
        .messages({
        'string.min': 'Le prénom doit contenir au moins 2 caractères',
        'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
    lastName: joi_1.default.string()
        .min(2)
        .max(50)
        .messages({
        'string.min': 'Le nom doit contenir au moins 2 caractères',
        'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
    bio: joi_1.default.string()
        .max(500)
        .messages({
        'string.max': 'La bio ne peut pas dépasser 500 caractères'
    }),
    birthDate: joi_1.default.date()
        .iso()
        .messages({
        'date.base': 'La date de naissance doit être une date valide'
    }),
    gender: joi_1.default.string()
        .valid('male', 'female', 'other')
        .messages({
        'any.only': 'Le genre doit être male, female ou other'
    }),
    preferences: joi_1.default.object({
        gender: joi_1.default.string()
            .valid('male', 'female', 'both')
            .messages({
            'any.only': 'La préférence de genre doit être male, female ou both'
        }),
        ageRange: joi_1.default.object({
            min: joi_1.default.number()
                .min(18)
                .max(100)
                .messages({
                'number.min': "L'âge minimum doit être d'au moins 18 ans",
                'number.max': "L'âge maximum ne peut pas dépasser 100 ans"
            }),
            max: joi_1.default.number()
                .min(18)
                .max(100)
                .messages({
                'number.min': "L'âge minimum doit être d'au moins 18 ans",
                'number.max': "L'âge maximum ne peut pas dépasser 100 ans"
            })
        })
    })
});
exports.updatePhotosSchema = joi_1.default.object({
    pictures: joi_1.default.array()
        .items(joi_1.default.string().uri())
        .min(1)
        .max(5)
        .required()
        .messages({
        'array.min': 'Au moins une photo est requise',
        'array.max': 'Maximum 5 photos autorisées',
        'string.uri': 'URL de photo invalide'
    })
});
//# sourceMappingURL=userValidator.js.map