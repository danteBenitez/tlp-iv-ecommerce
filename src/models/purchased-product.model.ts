import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../database/connection.js";
import { Product } from "./product.model.js";
import { Purchase } from "./purchase.model.js";


export class PurchasedProduct extends Model<InferAttributes<PurchasedProduct>, InferCreationAttributes<PurchasedProduct>> {
  declare purchased_product_id: CreationOptional<number>;
  declare product_amount: number;
  declare product_price: number;
  declare product_id: number;
  declare purchase_id: number;
}

PurchasedProduct.init(
  {
    purchased_product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    product_price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Product,
        key: Product.primaryKeyAttribute,
      },
    },
    purchase_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Purchase,
        key: Purchase.primaryKeyAttribute,
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelize
  }
)