import { body } from "express-validator";
import { ACCEPTED_PAYMENT_METHODS } from "../consts/payment-methods.js";

const formatter = new Intl.ListFormat("es", {
  type: "disjunction",
});
const acceptedPaymentMethodMessage = formatter.format(ACCEPTED_PAYMENT_METHODS);

export const makePurchaseSchema = [
  body("products.*.product_id")
    .notEmpty()
    .withMessage("`product_id` es requerido")
    .isInt({ gt: 0 })
    .withMessage("`product_id` debe ser un número entero positivo")
    .toInt(),
  body("products.*.amount")
    .notEmpty()
    .withMessage("`amount` es requerido")
    .isInt({ gt: 0 })
    .withMessage("`amount` debe ser un número entero positivo")
    .toInt(),
  body("products.length")
    .isInt({ gt: 0 })
    .withMessage("Una compra debe tener `products`"),
  body("payment_method")
    .notEmpty()
    .withMessage("`payment_method` es requerido")
    .isString()
    .withMessage("`payment_method` debe ser un string")
    .isIn(ACCEPTED_PAYMENT_METHODS)
    .withMessage(
      `Métodos de pagos aceptados son ${acceptedPaymentMethodMessage}`
    ),
];
