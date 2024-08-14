import express from "express";
import { config } from "./config/config.service.js";
import { sequelize } from "./database/connection.js";
import { Server } from "./server.js";

const app = express();

const server = new Server(app);

const PORT = config.getServerPort();

server
  .onBeforeStart(async () => {
    return sequelize
      .authenticate()
      .then(() => console.log("Conectado exitosamente a base de datos"))
      .catch((err) => console.error("Error al iniciar el servidor: ", err));
  })

server.start(PORT);
