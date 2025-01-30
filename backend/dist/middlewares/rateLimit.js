"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = void 0;
const requestLimits = {};
const rateLimit = (maxRequests, windowMs) => {
    return (req, res, next) => {
        const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
        if (typeof ip !== "string") {
            res.status(500).json({ message: "Unable to determine IP address." });
            return;
        }
        const currentTime = Date.now();
        if (!requestLimits[ip]) {
            requestLimits[ip] = { count: 1, timestamp: currentTime };
        }
        else {
            const timeDifference = currentTime - requestLimits[ip].timestamp;
            if (timeDifference < windowMs) {
                requestLimits[ip].count += 1;
                if (requestLimits[ip].count > maxRequests) {
                    res.status(429).json({ message: "Too many requests. Please try again later." });
                    return;
                }
            }
            else {
                requestLimits[ip] = { count: 1, timestamp: currentTime };
            }
        }
        next();
    };
};
exports.rateLimit = rateLimit;
//# sourceMappingURL=rateLimit.js.map