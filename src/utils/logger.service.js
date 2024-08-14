// @ts-check
import fs from "node:fs";

export class Logger {
    /** @type {number} */
    #file

    /**
    * @param {string} logDir
    * @returns {Logger}
    */
    static fromFile(logDir) {
        const logger = new Logger();
        logger.#file = fs.openSync(logDir, 'a');
        return logger;
    }

    /**
     * 
     * @param  {...any} msgs 
     */
    log(...msgs) {
        console.log(...msgs);
    }

    warn(...msgs) {
        console.warn(...msgs);
    }

    error(...msgs) {
        console.error(...msgs);
    }
}