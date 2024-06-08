"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkRoles = (requiredRoles) => (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(403).json({ message: "Access denied. User not authenticated." });
    }
    const userRoles = user.roles;
    const hasRoles = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRoles) {
        return res.status(403).json({ message: `Access denied. You don't have necessary permisions.` });
    }
    next();
};
exports.default = checkRoles;
