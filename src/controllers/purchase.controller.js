import { ProductNotFoundError } from "../services/product.service.js";
import {
  OutOfStockError,
  purchaseService,
} from "../services/purchase.service.js";

export class PurchaseController {
  /** @type {typeof purchaseService} */
  #purchaseService;

  constructor(purchaseService) {
    this.#purchaseService = purchaseService;
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async findAllPurchasesForBuyer(req, res) {
    const user = req.user;
    const found = await this.#purchaseService.findAllForBuyer(user.user_id);

    return res.status(200).json({ purchases: found });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async buyProductsInBulk(req, res) {
    const user = req.user;
    const { products, payment_method } = req.body;

    try {
      const purchase = await this.#purchaseService.buyInBulk(
        {
          payment_method,
        },
        products,
        user
      );

      res.status(200).json({
        ...purchase,
        message: "Compra realizada con éxito",
      });
    } catch (err) {
      if (err instanceof ProductNotFoundError) {
        return res.status(404).json({
          message: err.message,
        });
      }
      if (err instanceof OutOfStockError) {
        return res.status(400).json({
          message: err.message,
        });
      }
      console.error("Error al realizar compra: ", err);
      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }
}
