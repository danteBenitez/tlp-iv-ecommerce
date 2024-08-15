import { usersService } from "../services/user.service.js";

export class AuthMiddleware {
  /**
   * @type {typeof usersService}
   */
  #userService;

  constructor(userService) {
    this.#userService = userService;
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  async execute(req, res, next) {
    const token = this.#parseTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }
    const user = await this.#userService.findForToken(token);
    if (!user) {
      return res.status(401).json({
        message: "No estás autenticado",
      });
    }
    const { password, ...rest } = user.toJSON();
    req.user = rest;
    next();
  }

  /**
   * @param {string} header
   */
  #parseTokenFromHeader(header) {
    const matches = /Bearer (.+)/.exec(header);
    if (!matches) {
        return null;
    }
    return matches[1];
  }
}

const middlewareInstance = new AuthMiddleware(usersService);
export const authMiddleware =
  middlewareInstance.execute.bind(middlewareInstance);
