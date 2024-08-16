import { body, checkExact } from "express-validator";
import { ALLOWED_ROLES } from "../consts/roles.js";

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
  body("role")
    .notEmpty()
    .withMessage("El `role` es requerido")
    .isString()
    .withMessage("`role` debe ser un string")
    .isIn(ALLOWED_ROLES)
    .withMessage(`\`role\` debe ser uno de ${allowedRolesMessage}`),
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
    body("role")
      .optional()
      .isString()
      .withMessage("`role` debe ser un string")
      .isIn(ALLOWED_ROLES)
      .withMessage(`\`role\` debe ser uno de ${allowedRolesMessage}`),
  ]),
];
