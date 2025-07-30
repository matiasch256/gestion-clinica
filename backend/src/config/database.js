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
    max: 10, // Máximo de conexiones en el pool
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;
export const getPool = async () => {
  if (!pool) {
    pool = await mssql.connect(config);
    console.log("✅ Conexión exitosa a SQL Server");
  }
  return pool;
};
