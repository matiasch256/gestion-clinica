import mssql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
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
