import mssql from "mssql";

class DatabaseConnection {
  async connect() {
    throw new Error("Método connect() debe ser implementado");
  }
}

class SQLServerConnection extends DatabaseConnection {
  #config;
  #pool = null;

  constructor(config) {
    super();
    this.#config = config;
  }

  async connect() {
    this.#pool = this.#pool ?? (await mssql.connect(this.#config));
    return this.#pool;
  }
}

class DatabaseFactory {
  constructor(config) {
    this.config = config;
  }

  createConnection(type = "sqlserver") {
    switch (type) {
      case "sqlserver":
        return new SQLServerConnection(this.config);
      default:
        throw new Error("Tipo de base de datos no soportado");
    }
  }
}

export default DatabaseFactory;
