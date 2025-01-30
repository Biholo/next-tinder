"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccess = void 0;
const verifyAccess = (allowedRoles = []) => (req, res, next) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: "Unauthorized: User not authenticated." });
        return;
    }
    console.log(user.role);
    console.log(allowedRoles);
    if (!user.role || !allowedRoles.some(roleGroup => roleGroup.includes(user.role))) {
        res.status(403).json({ message: "Forbidden: You do not have access to this resource." });
        return;
    }
    next();
};
exports.verifyAccess = verifyAccess;
//# sourceMappingURL=verifyAccess.js.map