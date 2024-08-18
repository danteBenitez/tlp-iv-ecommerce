import { Transaction } from "sequelize";
import { PAYMENT_METHODS } from "../consts/payment-methods.js";
import { sequelize } from "../database/connection.js";
import { Purchase } from "../models/purchase.model.js";
import { PurchasedProduct } from "../models/purchased-product.model.js";
import {
  ProductNotFoundError,
  productService,
  ProductService,
} from "./product.service.js";

export class OutOfStockError extends Error {}
export class InvalidPaymentMethod extends Error {}

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
   * Retorna un arreglo de interés y descuento dado
   * un método de pago.
   *
   * @param {string} payment_method
   * @returns {Promise<{ interest: number, discount: number }>}
   */
  async #getInterestAndDiscountByPayment(payment_method) {
    const percentagesByPaymentMethod = {
      [PAYMENT_METHODS.CASH]: [0, 2],
      [PAYMENT_METHODS.CREDIT]: [2, 0],
      [PAYMENT_METHODS.DEBIT]: [1, 0],
    };
    const result = percentagesByPaymentMethod[payment_method];
    if (!result) {
      console.warn(
        "Se pasó un método desconocido a getInterestAndDiscountByPayment. Este es un error de lógica."
      );
      throw InvalidPaymentMethod("Método de pago desconocido");
    }
    return { interest: result[0], discount: result[1] };
  }

  /**
   * Encuentra todas las compras de un usuario comprador
   *
   * @param {number} buyer_id
   */
  async findAllForBuyer(buyer_id) {
    const purchases = await this.#purchaseModel.findAll({
      where: { buyer_id },
      include: [
        {
          model: PurchasedProduct,
          as: "purchased_products"
        },
      ],
    });

    const purchasesWithTotal = await Promise.all(
      purchases.map(async (p) => {
        return {
          purchase: p,
          total: await this.calculateTotal(p.purchased_products, p)
        };
      })
    );

    return purchasesWithTotal;
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
    const { interest, discount } = await this.#getInterestAndDiscountByPayment(
      purchaseData.payment_method
    );

    const purchase = await this.createEmptyPurchase(
      {
        ...purchaseData,
        interest_percentage: interest,
        discount_percentage: discount,
      },
      buyer
    );

    // Crear una transacción para que, en caso de un error,
    // podamos volver al estado anterior de la DB
    const purchasedProducts = await sequelize.transaction(async (t) => {
      const additions = products.map((product) => {
        return this.#addProductToPurchase(
          purchase,
          product.product_id,
          product.amount,
          t
        );
      });

      return await Promise.all(additions);
    });

    return {
      purchase,
      products: purchasedProducts,
      total: await this.calculateTotal(purchasedProducts, purchase),
    };
  }

  /**
   * Calcula el total de una compra.
   *
   * @param {PurchasedProduct[]} products
   * @param {Purchase} purchase
   */
  async calculateTotal(products, purchase) {
    const subtotal = products.reduce(
      (total, product) => total + product.product_price * product.product_amount,
      0
    );
    const withInterest =
      subtotal + (purchase.interest_percentage * subtotal) / 100;
    const total =
      withInterest - (purchase.discount_percentage * subtotal) / 100;
    return total;
  }

  /**
   * Crea una compra sin productos asociados.
   *
   * @param {{
   *    payment_method: string,
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
   * @param {Transaction} transaction
   * @returns {Promise<PurchasedProduct[]>}
   */
  async #addProductToPurchase(purchase, product_id, amount, transaction) {
    const product = await this.#productService.findById(product_id);

    if (!product) {
      throw new ProductNotFoundError("Producto no encontrado");
    }

    if (amount > product.stock) {
      throw new OutOfStockError(
        `Stock de producto ${product.name} insuficiente`
      );
    }

    await product.update({ stock: product.stock - amount }, { transaction });

    const purchasedProduct = await this.#purchasedProductModel.create(
      {
        product_amount: amount,
        product_id: product.product_id,
        purchase_id: purchase.purchase_id,
        product_price: product.price,
      },
      { transaction }
    );

    return purchasedProduct;
  }
}

export const purchaseService = new PurchaseService(
  Purchase,
  productService,
  PurchasedProduct
);
