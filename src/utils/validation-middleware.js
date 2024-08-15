import { validationResult } from "express-validator";

/**
 * Retorna un middleware que aplica una serie de validaciones a una petición,
 * y retorna un error 400 con los errores en caso de fallar.
 * 
 * @param {import("express-validator").ValidationChain[]} validations
 * @return {import("express").RequestHandler}
 */
export function validationMiddlewareFor(validations) {
    return async (req, res, next) => {
        for (const validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);

        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            errors: errors.array()
        });
    }
}