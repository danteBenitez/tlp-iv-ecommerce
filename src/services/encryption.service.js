// @ts-check
import bcrypt from "bcrypt";
import { config } from "../config/config.service";

class EncryptionService {
    /**
     * Encripta el string pasado como parámetro
     * 
     * @param {string} data
     */
    async encrypt(data) {
        return bcrypt.hash(data, config.getSalt());
    }

    /**
     * Compara un valor plano con un valor encriptado
     * 
     * @param {string} plain
     * @param {string} encrypted
     * @returns {Promise<boolean>} 
     */
    async compare(plain, encrypted) {
        return bcrypt.compare(plain, encrypted);
    }
}

export const encryptionService = new EncryptionService();