import { body } from "express-validator";

export const createProductSchema = [
  body("name")
    .notEmpty()
    .withMessage("`name` es requerido")
    .isString()
    .withMessage("`name` debe ser un string"),
  body("description")
    .notEmpty()
    .withMessage("`description` es requerida")
    .isString()
    .withMessage("`description` debe ser un string"),
  body("price")
    .notEmpty()
    .withMessage("`price` es requerido")
    .isFloat({ gt: 0 })
    .withMessage("`price` debe ser un número positivo")
    .toFloat(),
  body("category")
    .notEmpty()
    .withMessage("`category` es requerida")
    .isString()
    .withMessage("`category` debe ser un string"),
  body("stock")
    .notEmpty()
    .withMessage("`stock` es requerido")
    .isInt({ gt: 0 })
    .withMessage("`stock` debe ser un número positivo")
    .toInt(),
];

export const updateProductSchema = [
  body("name")
    .optional()
    .isString()
    .withMessage("`name` debe ser un string"),
  body("description")
    .optional()
    .isString()
    .withMessage("`description` debe ser un string"),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("`price` debe ser un número positivo")
    .toFloat(),
  body("category")
    .optional()
    .isString()
    .withMessage("`category` debe ser un string"),
  body("stock")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("`stock` debe ser un número positivo")
    .toInt(),
];