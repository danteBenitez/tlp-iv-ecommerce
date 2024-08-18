// @ŧs-check
import jwt from "jsonwebtoken";

const { JsonWebTokenError } = jwt;

import { Op } from "sequelize";
import { config } from "../config/config.service.js";
import { Role } from "../models/role.model.js";
import { UserRole } from "../models/user-roles.model.js";
import { User } from "../models/user.model.js";
import { encryptionService } from "./encryption.service.js";

export class ConflictingUserError extends Error {}
export class UserNotFoundError extends Error {}
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
   *
   * @type {typeof UserRole}
   */
  #userRoleModel;

  /**
   * @type {typeof encryptionService}
   */
  #encryptionService;

  constructor(userModel, roleModel, encryptionService, userRoleModel) {
    this.#userModel = userModel;
    this.#roleModel = roleModel;
    this.#encryptionService = encryptionService;
    this.#userRoleModel = userRoleModel;
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
    } catch (err) {
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
    const users = await this.#userModel.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
    return users;
  }

  /**
   * Encuentra y retorna un usuario por su ID
   *
   * @param {number} user_id
   */
  async findById(user_id) {
    const user = await this.#userModel.findByPk(user_id, {
      include: this.#roleModel,
    });
    return user;
  }

  /**
   * Actualiza un usuario con datos parciales.
   *
   * @param {number} user_id
   * @param {{
   *    username?: string,
   *    password?: string,
   *    email?: string,
   *    roles: string[]
   * }} userData
   */
  async update(user_id, userData) {
    const found = await this.#userModel.findByPk(user_id, {
      include: this.#roleModel,
    });
    if (!found) {
      throw UserNotFoundError("Usuario no encontrado.");
    }

    const otherUser = await this.#userModel.findOne({
      where: {
        user_id: { [Op.ne]: user_id },
        [Op.or]: {
          username: userData.username ?? "",
          email: userData.email ?? "",
        },
      },
    });

    if (userData.roles) {
      console.log(userData.roles);
      const roles = await this.#roleModel.findAll({
        where: { name: { [Op.or]: userData.roles } },
      });
      await found.setRoles(roles);
    }

    if (otherUser) {
      throw new ConflictingUserError("Nombre de usuario o email en uso");
    }

    await found.update({ ...userData });
    // `updated` no contiene las asociaciones a #roleModel.
    // Debemos hacer otra consulta a Base de datos para obtenerlas.

    return await this.#userModel.findByPk(user_id, {
      include: this.#roleModel,
    });
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
   *    roles: string[]
   * }} userData
   */
  async signUp(userData) {
    const roles = await this.#roleModel.findAll({
      where: { name: { [Op.or]: userData.roles } },
    });

    if (roles.length === 0) {
      console.warn(
        `Error al encontrar los roles ${roles.join(
          ","
        )}. El rol es requerido. Sincroniza la base de datos`
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

    const signedUp = await this.#userModel.create(
      {
        username: userData.username,
        password: await this.#encryptionService.encrypt(userData.password),
        email: userData.email,
      },
      {
        attributes: {
          exclude: ["password"],
        },
        include: this.#roleModel,
      }
    );
    signedUp.addRoles(roles);
    delete signedUp.password;

    return {
      user: signedUp,
      token: await this.createTokenFor(signedUp),
    };
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
      include: this.#roleModel,
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

  /**
   * Verifica si el usuario tiene el un rol con el nombre
   * dado por el parámetro `role`
   *
   * @param {User} user
   * @param {string} roleName
   */
  async matchesRole(user, roleName) {
    const role = await this.#roleModel.findOne({
      where: { name: roleName },
    });
    if (!role) {
      console.warning(
        "Rol no encontrado pasado a `matchesRole`. Este es un error lógico."
      );
      return false;
    }
    // Utilizamos el método `hasUser` generado por Sequelize
    // para verificar si un usuario pertenece a un rol
    return role.hasUser(user.user_id);
  }
}

export const usersService = new UsersService(
  User,
  Role,
  encryptionService,
  UserRole
);
