import "./src/config/env.js"; // <--- PONER ESTA LÍNEA PRIMERO
import bcrypt from "bcrypt";
import { getPool } from "./src/config/database.js";

const seedAdminUser = async () => {
  // ¡Usa una contraseña segura! Esta es solo un ejemplo.
  const password = "admin123matias";
  const saltRounds = 10;

  try {
    console.log("Generando hash para la contraseña...");
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log("Hash generado.");

    const pool = await getPool();
    console.log("Insertando usuario administrador en la base de datos...");

    await pool
      .request()
      .input("Nombre", "Administrador del Sistema")
      .input("Email", "matias32@gmail.com")
      .input("PasswordHash", passwordHash)
      .input("Rol", "Administrador").query(`
        INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol)
        VALUES (@Nombre, @Email, @PasswordHash, @Rol)
      `);

    console.log("✅ ¡Usuario administrador creado exitosamente!");
    process.exit(0); // Termina el script
  } catch (error) {
    // Ignora el error si es por clave única (el usuario ya existe)
    if (error.number === 2627) {
      console.log("⚠️ El usuario administrador ya existe en la base de datos.");
    } else {
      console.error(
        "❌ Error al crear el usuario administrador:",
        error.message
      );
    }
    process.exit(1);
  }
};

seedAdminUser();
