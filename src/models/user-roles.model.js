import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";
import { Role } from "./role.model.js";
import { User } from "./user.model.js";

export const UserRole = sequelize.define("UserRole", {
    user_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: "role_id"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "user_id"
        }
    }
});