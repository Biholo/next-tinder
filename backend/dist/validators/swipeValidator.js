"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSwipeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSwipeSchema = joi_1.default.object({
    target_user_id: joi_1.default.string()
        .required()
        .messages({
        'string.empty': "L'identifiant de l'utilisateur cible est requis"
    }),
    type: joi_1.default.string()
        .valid('LIKE', 'DISLIKE')
        .required()
        .messages({
        'any.only': 'Le type doit être LIKE ou DISLIKE',
        'any.required': 'Le type de swipe est requis'
    })
});
//# sourceMappingURL=swipeValidator.js.map