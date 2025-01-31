"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("@/controllers/userController");
const userValidator_1 = require("@/validators/userValidator");
const validate_1 = require("@/middlewares/validate");
const auth_1 = require("@/middlewares/auth");
const router = express_1.default.Router();
router.get('/', auth_1.isAuthenticated, userController_1.getProfilesToSwipe);
router.patch('/me', auth_1.isAuthenticated, (0, validate_1.validate)(userValidator_1.updateUserSchema, "body"), userController_1.updateCurrentUser);
router.post('/photos', auth_1.isAuthenticated, (0, validate_1.validate)(userValidator_1.updatePhotosSchema, "body"), userController_1.updatePictures);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map