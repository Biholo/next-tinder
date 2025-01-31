"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swipeController_1 = require("@/controllers/swipeController");
const swipeValidator_1 = require("@/validators/swipeValidator");
const validate_1 = require("@/middlewares/validate");
const auth_1 = require("@/middlewares/auth");
const router = express_1.default.Router();
router.post('/', auth_1.isAuthenticated, (0, validate_1.validate)(swipeValidator_1.createSwipeSchema, "body"), swipeController_1.createSwipe);
exports.default = router;
//# sourceMappingURL=swipeRoutes.js.map