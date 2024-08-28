import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../database/connection.js";
import { User } from "./user.model.js";

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare product_id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare price: number;
  declare category: string;
  declare stock: number;
  declare seller_id: number;
}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: User.primaryKeyAttribute,
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelize
  }
);
