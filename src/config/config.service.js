// @ts-check

/**
 * Función auxiliar que arroja un error de mensaje claro cuando una variable de entorno
 * está ausente.
 * 
 * @param {string} key
 */
const getEnvOrFail = (key) => {
  const value = process.env[key];
  if (value == null) {
    throw new Error(`Variable de entorno ${key} faltante.`);
  }
  return value;
}

class ConfigService {
  #config = {};

  static fromEnv() {
    const service = new ConfigService();
    service.#config = {
      DATABASE: {
        HOST: getEnvOrFail("DB_HOST"),
        PORT: getEnvOrFail("DB_PORT"),
        USER: getEnvOrFail("DB_USER"),
        PASSWORD: getEnvOrFail("DB_PASSWORD"),
        NAME: getEnvOrFail("DB_NAME"),
        DIALECT: getEnvOrFail("DB_DIALECT")
      },
      PORT: getEnvOrFail("PORT")
    };
    return service;
  }

  validateConfig() {
    const databaseConfig = this.getDatabaseOptions();
    if (!("DATABASE" in databaseConfig)) {
      throw new Error("");
    }
  }

  getDatabaseOptions() {
    return this.#config["DATABASE"];
  }

  getServerPort() {
    return parseInt(this.#config["PORT"]);
  }
}

export const config = ConfigService.fromEnv();