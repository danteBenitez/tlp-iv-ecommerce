import { ProductNotFoundError, productService } from "../services/product.service.js";

export class ProductController {
  /** @type {typeof productService} */
  #productService;

  constructor(productService) {
    this.#productService = productService;
  }


  /**
   * @param {import("express").Request}
   * @param {import("express").Response}
   */
  async findBySeller(req, res) {
    const user = req.user;
    const products = await this.#productService.findBySellerId(user.user_id);

    res.status(200).json({
      products
    });
  }

  /**
   * @param {import("express").Request}
   * @param {import("express").Response}
   */
  async registerProduct(req, res) {
    const seller = req.user;
    const product = await this.#productService.registerProduct(
      req.body,
      seller
    );

    return res.json({
        product,
        message: "Producto registrado exitosamente"
    });
  }

  /**
   * @param {import("express").Request}
   * @param {import("express").Response}
   */
  async updateProduct(req, res) {
    const user = req.user;
    const product_id = req.params.product_id;
    const numberId = parseInt(product_id);
    if (!product_id || Number.isNaN(numberId)) {
      return res.status(400).json({
        message: "ID de producto inválido"
      });
    }
    try {
      const updated = await this.#productService.update(numberId, req.body, user);

      return res.status(200).json({
        product: updated,
        message: "Producto actualizado exitosamente"
      });
    } catch(err) {
      if (err instanceof ProductNotFoundError) {
        return res.status(404).json({
          message: "Producto no encontrado"
        });
      }
      console.error("Error al actualizar producto: ", err);
      return res.status(500).json({
        message: "Error interno del servidor"
      })
    }
  }

  /**
   * @param {import("express").Request}
   * @param {import("express").Response}
   */
  async deleteProduct(req, res) {
    const user = req.user;
    const product_id = req.params.product_id;
    const numberId = parseInt(product_id);
    if (!product_id || Number.isNaN(numberId)) {
      return res.status(400).json({
        message: "ID de producto no válido"
      });
    }

    const deleted = await this.#productService.delete(numberId, user);

    if (!deleted) {
      return res.status(404).json({
        message: "Producto no encontrado"
      })
    }

    return res.status(200).json({ 
      message: "Producto eliminado exitosamente"
    });
  }
}
