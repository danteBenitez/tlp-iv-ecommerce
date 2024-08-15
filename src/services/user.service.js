// @ŧs-check
import jwt from "jsonwebtoken";

const { JsonWebTokenError } = jwt;

import { Op } from "sequelize";
import { config } from "../config/config.service.js";
import { ROLES } from "../consts/roles.js";
import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { encryptionService } from "./encryption.service.js";

export class ConflictingUserError extends Error {}
export class InvalidSignInError extends Error {}
export class InvalidRoleError extends Error {}

export class UsersService {
  /**
   * @type {typeof User}
   */
  #userModel;
  /**
   *
   * @type {typeof Role}
   */
  #roleModel;

  /**
   * @type {typeof encryptionService}
   */
  #encryptionService;

  constructor(userModel, roleModel, encryptionService) {
    this.#userModel = userModel;
    this.#roleModel = roleModel;
    this.#encryptionService = encryptionService;
  }

  /**
   * Crea un JWT para el usuario pasado como parámetro
   * @param {User} user
   */
  async createTokenFor(user) {
    return new Promise((resolve, reject) => {
      jwt.sign({ user_id: user.user_id }, config.getSecret(), (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   * Encuentra un usuario dado un JWT
   *
   * @param {string} token
   * @returns {Promise<User | null>} Retorna el usuario o
   * null si no se puede verificar el token.
   */
  async findForToken(token) {
    try {

    const { user_id } = await new Promise((resolve, reject) =>
      jwt.verify(token, config.getSecret(), (err, data) => {
        if (err) reject(err);
        else resolve(data);
      })
    );
    const user = await this.#userModel.findOne({ where: { user_id } });
    return user;
    } catch(err) {
      if (err instanceof JsonWebTokenError) {
        console.error("Error al verificar JWT: ", err);
      }
      return null;
    }
  }

  /**
   * Encuentra y retorna todos los usuarios.
   *
   * @returns {Promise<User[]>}
   */
  async findAll() {
    const users = await this.#userModel.findAll();
    return users;
  }

  /**
   * Borra un usuario con el ID pasado
   *
   * @param {string} id
   * @returns True en caso de que el ID exista. False en caso contrario
   */
  async delete(id) {
    const found = await this.#userModel.findByPk(id);
    if (!found) return false;
    await found.destroy();
    return true;
  }

  /**
   * Regístra un usuario con un rol de comprador o vendedor
   *
   * @param {{
   *    username: string,
   *    password: string,
   *    email: string,
   *    role: string
   * }} userData
   */
  async signUp(userData) {
    if (userData.role !== ROLES.BUYER && userData.role !== ROLES.SELLER) {
      throw new InvalidRoleError("Rol inválido");
    }

    const role = await this.#roleModel.findOne({
      where: { name: userData.role },
    });

    if (!role) {
      console.warn(
        `Error al encontrar rol ${role}. El rol es requerido. Sincroniza la base de datos`
      );
      throw new InvalidRoleError("Rol no encontrado");
    }

    const user = await this.#userModel.findOne({
      where: {
        [Op.or]: {
          username: userData.username,
          email: userData.email,
        },
      },
    });

    if (user) {
      throw new ConflictingUserError(
        "Nombre de usuario o correo electrónico en uso"
      );
    }

    const signedUp = await this.#userModel.create({
      username: userData.username,
      password: await this.#encryptionService.encrypt(userData.password),
      email: userData.email,
      role_id: role.role_id,
    });
    delete signedUp.password;

    return { user: signedUp, token: await this.createTokenFor(signedUp) };
  }

  /**
   * Inicia sesión a un usuario existente
   *
   * @param {{
   *    username: string,
   *    password: string,
   * }} userData
   */
  async signIn(userData) {
    const found = await this.#userModel.findOne({
      where: { username: userData.username },
    });

    if (!found) {
      throw new InvalidSignInError("Usuario o contraseña no válida");
    }

    const passwordsMatches = await this.#encryptionService.compare(
      userData.password,
      found.password
    );

    if (!passwordsMatches) {
      throw new InvalidSignInError("Usuario o contraseña no válida");
    }

    return { user: found, token: await this.createTokenFor(found) };
  }
}

export const usersService = new UsersService(User, Role, encryptionService);
