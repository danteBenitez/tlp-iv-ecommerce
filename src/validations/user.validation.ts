import { body, checkExact } from "express-validator";
import { ADMIN_ALLOWED_ROLES, ALLOWED_ROLES } from "../consts/roles.js";

export const signInUserSchema = [
  body("username")
    .notEmpty()
    .withMessage("El `username` es requerido")
    .isString()
    .withMessage("`username` debe ser un string"),
  body("password")
    .notEmpty()
    .withMessage("La `password` es requerida")
    .isString()
    .withMessage("`password` debe ser un string"),
];

const formatter = new Intl.ListFormat("es", {
  type: "disjunction",
});
const allowedRolesMessage = formatter.format(ALLOWED_ROLES);

export const signUpUserSchema = [
  body("username")
    .notEmpty()
    .withMessage("El `username` es requerido")
    .isString()
    .withMessage("`username` debe ser un string"),
  body("password")
    .notEmpty()
    .withMessage("La `password` es requerida")
    .isString()
    .withMessage("`password` debe ser un string")
    .isStrongPassword({
      minLength: 8,
      minSymbols: 0,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage(
      "La `password` no es segura. Debe contener mínimo 8 caracteres, una mayúscula, una minúscula y un número"
    ),
  body("email")
    .notEmpty()
    .withMessage("El `email` es requerido")
    .isString()
    .withMessage("`email` debe ser un string")
    .isEmail()
    .withMessage("`email` inválido"),
  body("roles").notEmpty().isArray().withMessage("`roles` debe ser un arreglo"),
  body("roles.length").notEmpty().withMessage("`roles` es requerido"),
  body("roles.*")
    .notEmpty()
    .withMessage("Los `roles` son requeridos")
    .isString()
    .withMessage("`role` debe ser un string")
    .isIn(ALLOWED_ROLES)
    .withMessage(`\`roles\` debe contener sólo ${allowedRolesMessage}`),
];

export const updateUserSchema = [
  checkExact([
    body("username")
      .optional()
      .isString()
      .withMessage("`username` debe ser un string"),
    body("password")
      .optional()
      .isString()
      .withMessage("`password` debe ser un string")
      .isStrongPassword({
        minLength: 8,
        minSymbols: 0,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .withMessage(
        "La `password` no es segura. Debe contener mínimo 8 caracteres, una mayúscula, una minúscula y un número"
      ),
    body("email")
      .optional()
      .isString()
      .withMessage("`email` debe ser un string")
      .isEmail()
      .withMessage("`email` inválido"),
    body("roles")
      .notEmpty()
      .isArray()
      .withMessage("`roles` debe ser un arreglo"),
    body("roles.length").notEmpty().withMessage("`roles` es requerido"),
    body("roles.*")
      .notEmpty()
      .withMessage("Los `roles` son requeridos")
      .isString()
      .withMessage("`role` debe ser un string")
      .isIn(ALLOWED_ROLES)
      .withMessage(`\`roles\` debe contener sólo ${allowedRolesMessage}`),
  ]),
];

const adminRolesMessage = formatter.format(ADMIN_ALLOWED_ROLES);

export const updateUserByAdminSchema = [
  checkExact([
    body("username")
      .optional()
      .isString()
      .withMessage("`username` debe ser un string"),
    body("password")
      .optional()
      .isString()
      .withMessage("`password` debe ser un string")
      .isStrongPassword({
        minLength: 8,
        minSymbols: 0,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .withMessage(
        "La `password` no es segura. Debe contener mínimo 8 caracteres, una mayúscula, una minúscula y un número"
      ),
    body("email")
      .optional()
      .isString()
      .withMessage("`email` debe ser un string")
      .isEmail()
      .withMessage("`email` inválido"),
    body("roles")
      .notEmpty()
      .isArray()
      .withMessage("`roles` debe ser un arreglo"),
    body("roles.length").notEmpty().withMessage("`roles` es requerido"),
    body("role.*")
      .notEmpty()
      .withMessage("Los `roles` son requeridos")
      .isString()
      .withMessage("`role` debe ser un string")
      .isIn(ADMIN_ALLOWED_ROLES)
      .withMessage(`\`roles\` debe contener sólo ${adminRolesMessage}`),
  ]),
];
