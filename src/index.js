import express from "express";
import { config } from "./config/config.service.js";
import { Server } from "./server.js";
import { setupDatabase } from "./database/setup.js";

const app = express();

const server = new Server(app);

const PORT = config.getServerPort();

server
  .onBeforeStart(async () => {
    return setupDatabase()
      .then(() => console.log("Conectado exitosamente a base de datos"))
      .catch((err) => console.error("Error al iniciar el servidor: ", err));
  })

server.start(PORT);
