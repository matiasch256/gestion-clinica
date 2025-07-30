class DatabaseConnection {
  async connect() {
    throw new Error("Método connect() debe ser implementado");
  }
}

class SQLServerConnection extends DatabaseConnection {
  constructor(config) {
    super();
    this.config = config;
    this.pool = null;
  }

  async connect() {
    if (!this.pool) {
      this.pool = await require("mssql").connect(this.config);
    }
    return this.pool;
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

module.exports = DatabaseFactory;
