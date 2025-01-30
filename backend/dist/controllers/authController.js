"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.getUserFromToken = exports.login = exports.register = void 0;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel_1 = __importDefault(require("@/models/userModel"));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const TOKEN_EXPIRATION = "1h";
const register = async (req, res) => {
    const { firstName, lastName, email, password, roles } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ message: "Tous les champs sont requis." });
        return;
    }
    try {
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "Cet email est déjà utilisé." });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRoles = Array.isArray(roles) ? roles : ["ROLE_CLIENT"];
        const newUser = new userModel_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            roles: userRoles,
        });
        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès." });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription.", error });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email et mot de passe requis." });
        return;
    }
    try {
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "Utilisateur introuvable." });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Mot de passe incorrect." });
            return;
        }
        const accessToken = jwt.sign({ id: user._id, roles: user.roles }, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION });
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET);
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({ access_token: accessToken, refresh_token: refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion.", error });
    }
};
exports.login = login;
const getUserFromToken = async (req, res) => {
    const userReq = req.user;
    try {
        const user = await userModel_1.default.findById(userReq === null || userReq === void 0 ? void 0 : userReq.id).select("-password");
        if (!user) {
            res.status(404).json({ message: "Utilisateur introuvable." });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré." });
    }
};
exports.getUserFromToken = getUserFromToken;
const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.status(401).json({ message: "Token de rafraîchissement requis." });
        return;
    }
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        const user = await userModel_1.default.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            res.status(403).json({ message: "Token invalide." });
            return;
        }
        const newAccessToken = jwt.sign({ id: user._id, roles: user.roles }, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION });
        const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET);
        user.refreshToken = newRefreshToken;
        await user.save();
        res.status(200).json({ access_token: newAccessToken, refresh_token: newRefreshToken });
    }
    catch (error) {
        res.status(403).json({ message: "Token de rafraîchissement invalide ou expiré." });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.status(400).json({ message: "Token de rafraîchissement requis pour la déconnexion." });
        return;
    }
    try {
        const user = await userModel_1.default.findOne({ refreshToken: token });
        if (!user) {
            res.status(403).json({ message: "Token invalide." });
            return;
        }
        user.refreshToken = undefined;
        await user.save();
        res.status(200).json({ message: "Déconnexion réussie." });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la déconnexion.", error });
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map