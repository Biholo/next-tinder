import Joi from "joi";
import dayjs from "dayjs";

export const registerSchema = Joi.object({
    lastName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": 'Le nom est requis',
            "string.min": 'Le nom doit contenir au moins 2 caractères',
            "string.max": 'Le nom ne peut pas dépasser 50 caractères'
        }),
    firstName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": 'Le prénom est requis',
            "string.min": 'Le prénom doit contenir au moins 2 caractères',
            "string.max": 'Le prénom ne peut pas dépasser 50 caractères'
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": 'Le mail est requis',
            "string.email": "Email invalide",
            "any.required": "Email requis",
        }),
    phone: Joi.string()
        .required()
        .messages({
            "string.empty": 'Le numéro de téléphone est requis',
            "any.required": "Numéro de téléphone requis",
        }),
    dateOfBirth: Joi.date()
        .max(dayjs().subtract(18, "years").toDate())
        .required()
        .messages({
          "date.base": "La date de naissance doit être une date valide",
          "date.max": "Vous devez avoir au moins 18 ans",
          "any.required": "La date de naissance est requise",
        }),
    gender: Joi.string()
        .valid()
        .required()
        .messages({
            "any.only": "Genre invalide",
            "any.required": "Genre requis",
    }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty": 'Le mot de passe est requis',
            "string.min": "Le mot de passe doit contenir au moins 6 caractères",
            "any.required": "Mot de passe requis",
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Les mots de passe ne correspondent pas",
            "any.required": "La confirmation du mot de passe est requise",
        }),
});

