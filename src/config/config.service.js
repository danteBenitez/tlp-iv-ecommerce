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
        DIALECT: getEnvOrFail("DB_DIALECT"),
        SHOULD_FORCE: process.env.NODE_ENV !== "production" && process.argv[2] == "force"
      },
      PORT: getEnvOrFail("PORT"),
      SALT_ROUNDS: parseInt(getEnvOrFail("SALT_ROUNDS")),
      SECRET: getEnvOrFail("JWT_SECRET")
    };
    return service;
  }


  getSecret() {
    return this.#config["SECRET"];
  }

  getSalt() {
    return this.#config["SALT_ROUNDS"];
  }

  getDatabaseOptions() {
    return this.#config["DATABASE"];
  }

  getServerPort() {
    return parseInt(this.#config["PORT"]);
  }
}

export const config = ConfigService.fromEnv();