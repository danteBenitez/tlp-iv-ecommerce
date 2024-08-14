// @ts-check

class ConfigService {
  #config = {};

  static fromEnv() {
    const service = new ConfigService();
    service.#config = {
      DATABASE: {
        HOST: process.env.DB_HOST ?? "localhost",
        PORT: process.env.DB_PORT ?? "5432",
        USER: process.env.DB_USER ?? "root",
        PASSWORD: process.env.DB_PASSWORD ?? "root",
        NAME: process.env.DB_NAME ?? "ecommerce",
        DIALECT: process.env.DB_DIALECT ?? "postgres",
      },
      PORT: process.env.PORT ?? 3000,
    };
    return service;
  }

  getDatabaseOptions() {
    return this.#config["DATABASE"];
  }

  getServerPort() {
    return parseInt(this.#config["PORT"]);
  }
}

export const config = ConfigService.fromEnv();