import mssql from "mssql";

const config = {
  user: process.env.DB_USER?.trim(),
  password: process.env.DB_PASSWORD?.trim(),
  server: process.env.DB_SERVER?.trim(),
  database: process.env.DB_DATABASE?.trim(),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;
export const getPool = async () => {
  try {
    if (!pool) {
      pool = await mssql.connect(config);
    }
    return pool;
  } catch (error) {
    throw new Error(`Error al conectar a la base de datos: ${error.message}`);
  }
};
