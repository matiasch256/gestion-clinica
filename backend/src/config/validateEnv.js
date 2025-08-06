export const validateEnvVars = () => {
  const vars = ["DB_USER", "DB_PASSWORD", "DB_SERVER", "DB_DATABASE"];
  for (const name of vars) {
    if (!process.env[name]?.trim()) {
      throw new Error(`La variable de entorno ${name} no está definida`);
    }
  }
};
