import "./src/config/env.js";
import bcrypt from "bcrypt";
import { getPool } from "./src/config/database.js";

const NUEVO_NOMBRE = process.env.NEW_USER_NAME;
const NUEVO_EMAIL = process.env.NEW_USER_EMAIL;
const NUEVA_PASSWORD_PLANA = process.env.NEW_USER_PASSWORD;
const NUEVO_ROL = process.env.NEW_USER_ROL || "Usuario";

const createNewUser = async () => {
  if (!NUEVO_NOMBRE || !NUEVO_EMAIL || !NUEVA_PASSWORD_PLANA) {
    console.error(
      "❌ Por favor, asegúrate de que las variables NEW_USER_NAME, NEW_USER_EMAIL y NEW_USER_PASSWORD estén definidas en tu archivo .env"
    );
    return;
  }

  const saltRounds = 10;

  try {
    console.log(`Generando hash para la contraseña de ${NUEVO_NOMBRE}...`);
    const passwordHash = await bcrypt.hash(NUEVA_PASSWORD_PLANA, saltRounds);
    console.log("Hash generado exitosamente.");

    const pool = await getPool();
    console.log(`Insertando al usuario ${NUEVO_EMAIL} en la base de datos...`);

    await pool
      .request()
      .input("Nombre", NUEVO_NOMBRE)
      .input("Email", NUEVO_EMAIL)
      .input("PasswordHash", passwordHash)
      .input("Rol", NUEVO_ROL).query(`
        INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol)
        VALUES (@Nombre, @Email, @PasswordHash, @Rol)
      `);

    console.log(`✅ ¡Usuario '${NUEVO_NOMBRE}' creado exitosamente!`);
  } catch (error) {
    if (error.number === 2627) {
      console.log(
        `⚠️  El email '${NUEVO_EMAIL}' ya existe en la base de datos.`
      );
    } else {
      console.error("❌ Error al crear el usuario:", error.message);
    }
  } finally {
    process.exit(0);
  }
};

createNewUser();
