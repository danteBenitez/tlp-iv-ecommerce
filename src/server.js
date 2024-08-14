// @ts-check
import express from "express";
import morgan from "morgan";
import helmet from "helmet";

export class Server {
    #onBeforeStartCallbacks

    constructor(httpServer) {
        this.httpServer = httpServer;
        this.#onBeforeStartCallbacks = [];
        this.addMiddleware();
    }

    async start(port = 3000) {
        for (const callback of this.#onBeforeStartCallbacks) {
            await callback();
        }

        return this.httpServer.listen(port, () => {
            console.log('Server started on port 3000');
        })
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
