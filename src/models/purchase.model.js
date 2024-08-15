import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";
import { User } from "./user.model.js";

export const Purchase = sequelize.define(
  "Purchase",
  {
    purchase_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount_percentage: {
      type: DataTypes.FLOAT,
      default: 0,
    },
    interest_percentage: {
      type: DataTypes.FLOAT,
      default: 0,
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: User.primaryKeyAttribute,
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);
