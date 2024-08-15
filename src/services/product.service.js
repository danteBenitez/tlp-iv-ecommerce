import { Op } from "sequelize";
import { Product } from "../models/product.model.js";

export class ProductNotFoundError extends Error {}

export class ProductService {
    /** @type {typeof Product} */
    #productModel;

    constructor(productModel) {
        this.#productModel = productModel;
    }

    /**
     * Encuentra todos los productos disponibles para la venta
     */
    async findAllToSell() {
        const products = await this.#productModel.findAll({
            where: {
                stock: {
                    [Op.gt]: 0
                }
            }
        });

        return products;
    }

    /**
     * Encuentra los productos ofrecidos por un vendedor
     * 
     * @param {number} seller_id
     */
    async findBySellerId(seller_id) {
        const products = await this.#productModel.findAll({
            where: { seller_id }
        });
        return products;
    }

    /**
     * Encuentra todos los productos dada una categoría
     * 
     * @param {string} category
     */
    async findByCategory(category) {
        const found = await this.#productModel.findAll({
            where: { category }
        });

        if (found.length === 0) {
            throw new ProductNotFoundError("Producto no encontrado para esta categoría");
        }

        return found;
    }

    /**
     * Encuentra un producto por ID
     * 
     * @param {number} product_id
     */
    async findById(product_id) {
        const product = await this.#productModel.findByPk(product_id);
        return product;
    }

    /**
     * Actualiza los atributos de un producto dado su ID
     * y sus datos. Los datos pasados sobreescriben
     * a los actuales. 
     * No es necesario pasar un valor para cada atributo
     * 
     * @param {number} product_id
     * @param {{
     *   name: string,
     *   description: string,
     *   price: number,
     *   category: string,
     *   stock: string,
     *   seller_id: number 
     * }} productData
     * @param {User} seller
     */
    async update(product_id, productData, seller) {
        const found = await this.#productModel.findOne({
            where: {
                product_id,
                seller_id: seller.user_id
            }
        });

        if (!found) {
            throw new ProductNotFoundError("Producto no encontrado");
        }

        await found.update(productData);

        return found;
    }

    /**
     * Remueve un producto ofrecido para la venta dado su ID y
     * su vendedor.
     * 
     * @param {number} product_id
     * @param {User} seller
     * @returns {boolean} True si existe el producto, false en otro caso.
     */
    async delete(product_id, seller) {
        const product = await this.#productModel.findOne({
            where: {
                product_id,
                seller_id: seller.user_id
            }
        });

        if (!product) {
            return false;
        }

        await product.destroy();

        return true;
    }
}