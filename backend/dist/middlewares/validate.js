"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, property) => (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
        const validationErrors = error.details.map((err) => err.message);
        res.status(400).json({
            message: "Invalid data.",
            errors: validationErrors,
        });
        return;
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map