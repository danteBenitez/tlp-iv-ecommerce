// @ts-check
import express from "express";
import morgan from "morgan";
import helmet from "helmet";

import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";

export class Server {
    #onBeforeStartCallbacks

    /**
     * 
     * @param {import("express").Express} httpServer 
     */
    constructor(httpServer) {
        this.httpServer = httpServer;
        this.#onBeforeStartCallbacks = [];
        this.addMiddleware();
        this.routes();
    }

    async start(port = 3000) {
        for (const callback of this.#onBeforeStartCallbacks) {
            await callback();
        }

        return this.httpServer.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        })
    }

    routes() {
        this.httpServer.use(userRouter);
        this.httpServer.use("/products", productRouter);
    }

    addParsers() {
        this.httpServer.use(express.json());
        this.httpServer.use(express.urlencoded({ extended: false }));
    }

    addMiddleware() {
        this.addParsers();

        this.httpServer.use(morgan("dev"));
        this.httpServer.use(helmet());
    }

    /**
     * Registra un callback a ser llamado antes de iniciar el servidor.
     * 
     * @param {() => void} callback
     */
    onBeforeStart(callback) {
        this.#onBeforeStartCallbacks.push(callback);
    }
}
