import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import productRouter from "./routes/product.routes.js";
import purchaseRouter from "./routes/purchase.routes.js";
import userRouter from "./routes/user.routes.js";

type Callback = () => Promise<void>;

export class Server {
    #onBeforeStartCallbacks: Callback[];

    constructor(
        private app: express.Application
    ) {
        this.#onBeforeStartCallbacks = [];
        this.addMiddleware();
        this.routes();
    }

    async start(port = 3000) {
        for (const callback of this.#onBeforeStartCallbacks) {
            await callback();
        }

        return this.app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        })
    }

    routes() {
        this.app.use(userRouter);
        this.app.use("/products", productRouter);
        this.app.use("/purchase", purchaseRouter);
    }

    addParsers() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    addMiddleware() {
        this.addParsers();

        this.app.use(morgan("dev"));
        this.app.use(helmet());
    }

    /**
     * Registra un callback a ser llamado antes de iniciar el servidor.
     */
    onBeforeStart(callback: Callback) {
        this.#onBeforeStartCallbacks.push(callback);
    }
}
