"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createMessageSchema = joi_1.default.object({
    match_id: joi_1.default.string()
        .required()
        .messages({
        'string.empty': "L'identifiant du match est requis"
    }),
    content: joi_1.default.string()
        .required()
        .min(1)
        .max(1000)
        .messages({
        'string.empty': 'Le contenu du message est requis',
        'string.min': 'Le message ne peut pas être vide',
        'string.max': 'Le message ne peut pas dépasser 1000 caractères'
    })
});
//# sourceMappingURL=messageValidator.js.map