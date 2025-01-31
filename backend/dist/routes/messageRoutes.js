"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("@/controllers/messageController");
const messageValidator_1 = require("@/validators/messageValidator");
const validate_1 = require("@/middlewares/validate");
const auth_1 = require("@/middlewares/auth");
const router = express_1.default.Router();
router.post('/', auth_1.isAuthenticated, (0, validate_1.validate)(messageValidator_1.createMessageSchema, "body"), messageController_1.createMessage);
router.get('/:match_id', auth_1.isAuthenticated, messageController_1.getMatchMessages);
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map