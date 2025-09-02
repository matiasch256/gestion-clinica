import { getPool } from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (email, password) => {
  const pool = await getPool();

  // 1. Buscar al usuario por email
  const result = await pool
    .request()
    .input("Email", email)
    .query("SELECT * FROM Usuarios WHERE Email = @Email");

  const user = result.recordset[0];

  // 2. Verificar si el usuario existe y está activo
  if (!user) {
    throw new Error("Credenciales inválidas."); // Mensaje genérico
  }
  if (!user.Activo) {
    throw new Error(
      "Su cuenta ha sido desactivada. Contacte al administrador."
    );
  }

  // 3. Comparar la contraseña enviada con el hash guardado
  const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
  if (!isPasswordValid) {
    throw new Error("Credenciales inválidas."); // Mensaje genérico
  }

  // 4. Si todo es correcto, generar un JSON Web Token (JWT)
  // El token contiene información (payload) que identifica al usuario
  const payload = {
    id: user.UsuarioID,
    email: user.Email,
    rol: user.Rol,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "8h", // El token expirará en 8 horas
  });

  // No enviar el hash de la contraseña al frontend
  delete user.PasswordHash;

  return { user, token };
};
