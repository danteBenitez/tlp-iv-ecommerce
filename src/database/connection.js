import { Sequelize } from "sequelize";
import { config } from "../config/config.service.js";

const databaseConfig = config.getDatabaseOptions();

export const sequelize = new Sequelize({
  dialect: databaseConfig.DIALECT,
  host: databaseConfig.HOST,
  port: databaseConfig.PORT,
  username: databaseConfig.USER,
  password: databaseConfig.PASSWORD,
  database: databaseConfig.NAME,
});
