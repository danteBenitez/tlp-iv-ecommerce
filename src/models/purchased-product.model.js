import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";
import { Product } from "./product.model.js";
import { Purchase } from "./purchase.model.js";

export const PurchasedProduct = sequelize.define(
  "PurchasedProduct",
  {
    purchased_product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_amount: {
      type: DataTypes.INTEGER,
      default: 1,
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
  }
);
