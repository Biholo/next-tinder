"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasToken = exports.isAuthenticated = void 0;
const jwt = require("jsonwebtoken");
const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Token manquant." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré." });
    }
};
exports.isAuthenticated = isAuthenticated;
const hasToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next();
    }
    else {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
            next();
        }
        catch (error) {
            next();
        }
    }
};
exports.hasToken = hasToken;
//# sourceMappingURL=auth.js.map