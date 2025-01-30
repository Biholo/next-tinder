"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("@/controllers/authController");
const validate_1 = require("@/middlewares/validate");
const auth_1 = require("@/middlewares/auth");
const verifyAccess_1 = require("@/middlewares/verifyAccess");
const userValidator_1 = require("@/validators/userValidator");
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
router.post("/register", (0, validate_1.validate)(userValidator_1.registerSchema, "body"), authController_1.register);
router.post("/login", (0, validate_1.validate)(userValidator_1.loginSchema, "body"), authController_1.login);
router.get("/me", auth_1.isAuthenticated, authController_1.getUserFromToken);
router.post("/refresh", (0, validate_1.validate)(joi_1.default.object({
    token: joi_1.default.string().required().messages({
        "any.required": "Le champ token est obligatoire.",
    }),
}), "body"), authController_1.refreshToken);
router.post("/logout", (0, validate_1.validate)(joi_1.default.object({
    token: joi_1.default.string().required().messages({
        "any.required": "Le champ token est obligatoire.",
    }),
}), "body"), authController_1.logout);
router.get("/", auth_1.isAuthenticated, (0, verifyAccess_1.verifyAccess)(["admin"]), (0, validate_1.validate)(userValidator_1.filterUserSchema, "query"), async (req, res) => {
    res.status(200).json({ message: "Route de filtrage des utilisateurs." });
});
router.put("/:id", auth_1.isAuthenticated, (0, verifyAccess_1.verifyAccess)(["admin"]), (0, validate_1.validate)(userValidator_1.updateUserSchema, "body"), async (req, res) => {
    res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
});
router.patch("/:id/permissions", auth_1.isAuthenticated, (0, verifyAccess_1.verifyAccess)(["admin"]), (0, validate_1.validate)(userValidator_1.updateUserPermissionsSchema, "body"), async (req, res) => {
    res.status(200).json({ message: "Permissions mises à jour avec succès." });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map