import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../database/connection.js";
import { User } from "./user.model.js";

export class Purchase extends Model<InferAttributes<Purchase>, InferCreationAttributes<Purchase>> {
  declare purchase_id: CreationOptional<number>;
  declare payment_method: string;
  declare discount_percentage: number;
  declare interest_percentage: number;
  declare buyer_id: number;
}

Purchase.init(
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
      defaultValue: 0
    },
    interest_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0
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
    sequelize
  }
)
