"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const matchController_1 = require("@/controllers/matchController");
const auth_1 = require("@/middlewares/auth");
const router = express_1.default.Router();
router.get('/', auth_1.isAuthenticated, matchController_1.getMatches);
exports.default = router;
//# sourceMappingURL=matchRoutes.js.map