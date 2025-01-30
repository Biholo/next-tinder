"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        userId: user._id,
        email: user.email
    }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
};
exports.generateToken = generateToken;
const verifyToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        return decoded;
    }
    catch (error) {
        throw new Error('Token invalide ou expiré');
    }
};
exports.verifyToken = verifyToken;
const decodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch (_a) {
        return null;
    }
};
exports.decodeToken = decodeToken;
//# sourceMappingURL=jwt.js.map