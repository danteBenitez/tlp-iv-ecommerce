import express from "express";

// Tratar de importar las clases normalmente da un error
// por ser express un módulo CommonJS.
const { Request, Response } = express;

import {
  ConflictingUserError,
  InvalidRoleError,
  InvalidSignInError,
  usersService,
} from "../services/user.service.js";

export class UserController {
  /** @type {typeof usersService} */
  #usersService;

  constructor(userService) {
    this.#usersService = userService;
  }

  /**
   * @param {Request} req
   * @param {Response} res
   */
  findAllUsers(req, res) {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    return this.#usersService.findAll();
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   */
  async signIn(req, res) {
    const { username, password } = req.body;
    try {
      const { user, token } = await this.#usersService.signIn({ username, password });

      const { password: _, ...withoutPassword } = user.toJSON();

      res.status(200).json({
        user: withoutPassword,
        token,
        message: "Iniciado sesión correctamente",
      });
    } catch (err) {
      if (err instanceof InvalidSignInError) {
        return res.status(400).json({
          message: err.message,
        });
      }
      console.error("Error al iniciar sesión: ", err);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * @param {Request} req
   * @param {Response} res
   */
  async signUp(req, res) {
    const { username, password, email, role } = req.body;
    try {
      const { user, token } = await this.#usersService.signUp({
        username,
        password,
        email,
        role,
      });

      const { password: _, ...withoutPassword } = user.toJSON();

      res.status(200).json({
        user: withoutPassword,
        token,
        message: "Registrado correctamente",
      });
    } catch (err) {
      console.error("Error al registrar usuario: ", err);
      if (err instanceof InvalidRoleError) {
        return res.status(400).json({
          message: err.message,
        });
      }
      if (err instanceof ConflictingUserError) {
        return res.status(400).json({
          message: err.message,
        });
      }
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }
}
