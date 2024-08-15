import { Purchase } from "../models/purchase.model";
import { PurchasedProduct } from "../models/purchased-product.model";
import { ProductNotFoundError, ProductService } from "./product.service";

export class PurchaseService {
  /** @type {typeof Purchase} */
  #purchaseModel;

  /** @type {typeof InstanceType<ProductService>} */
  #productService;

  /** @type {typeof PurchasedProduct} */
  #purchasedProductModel;

  constructor(purchaseModel, productService, purchasedProductModel) {
    this.#purchaseModel = purchaseModel;
    this.#productService = productService;
    this.#purchasedProductModel = purchasedProductModel;
  }

  /**
   * Encuentra todas las compras de un usuario comprador
   * 
   * @param {number} buyer_id
   */
  async findAllForBuyer(buyer_id) {
    const purchases = await this.#purchaseModel.findAll({
        where: { buyer_id }
    });

    return purchases;
  }

  /**
   * Realiza una compra de varios productos a la vez,
   * a través de una sola compra.
   *
   * @param {{
   *    payment_method: string,
   *    discount_percentage?: string,
   *    interest_percentage?: string,
   * }} purchaseData
   * @param {{ product_id: number, amount: number }[]} products
   * @param {User} buyer
   */
  async buyInBulk(purchaseData, products, buyer) {
    const purchase = await this.createEmptyPurchase(purchaseData, buyer);

    const additions = products.map((product) => {
      return this.addProductToPurchase(
        purchase,
        product.product_id,
        product.amount
      );
    });

    const purchasedProducts = await Promise.all(additions);

    return purchasedProducts;
  }

  /**
   * Crea una compra sin productos asociados.
   *
   * @param {{
   *    payment_method: string,
   *    discount_percentage?: string,
   *    interest_percentage?: string,
   * }} purchaseData
   * @param {User} buyer
   */
  async createEmptyPurchase(purchaseData, buyer) {
    const purchase = await this.#purchaseModel.create({
      payment_method: purchaseData.payment_method,
      discount_percentage: purchaseData.discount_percentage ?? 0,
      interest_percentage: purchaseData.interest_percentage ?? 0,
      buyer_id: buyer.user_id,
    });

    return purchase;
  }

  /**
   * Añade un producto a la compra, creando una
   * instancia de {@link PurchasedProduct}
   *
   * @param {Purchase} purchase
   * @param {number} product_id
   * @param {number} amount
   * @returns {Promise<PurchasedProduct[]>}
   */
  async addProductToPurchase(purchase, product_id, amount) {
    const product = await this.#productService.findById(product_id);

    if (!product) {
      throw new ProductNotFoundError("Producto no encontrado");
    }

    if (amount > product.stock) {
      throw new OutOfStockError(
        `Stock de producto ${product.name} insuficiente`
      );
    }

    await product.update({ stock: product.stock - amount });

    const purchasedProduct = await this.#purchasedProductModel.create({
      product_amount: amount,
      product_id: product.product_id,
      purchase_id: purchase.purchase_id,
    });

    return purchasedProduct;
  }
}
