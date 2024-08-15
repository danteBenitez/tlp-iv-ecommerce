import { usersService } from "../services/user.service.js";
import { authMiddleware } from "./auth.middleware.js";

export class RoleMiddleware {
  /** @type {typeof usersService} */
  #userService;

  constructor(userService, role) {
    this.#userService = userService;
    this.role = role;
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  async execute(req, res, next) {
    if (!req.user) {
      console.warn(
        "No se pudo encontrar usuario en la petición al verificar rol."
      );
      return res.status(401).json({
        message: "No se encuentra autorizado",
      });
    }

    const matches = await this.#userService.matchesRole(req.user, this.role);

    if (!matches) {
      return res.status(401).json({
        message: "No se encuentra autorizado",
      });
    }

    return next();
  }
}

/**
 * Retorna un arreglo de middlewares que chequean si:
 *  - la petición está autenticada
 *  - el usuario tiene el rol especificado.
 * @param {string} role Nombre del rol
*/
export function roleMiddleware(role) {
    const instance = new RoleMiddleware(usersService, role);
    return [authMiddleware, instance.execute.bind(instance)];
}
