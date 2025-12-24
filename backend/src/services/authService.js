import { getPool } from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (email, password) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Email", email)
    .query("SELECT * FROM Usuarios WHERE Email = @Email");

  const user = result.recordset[0];

  if (!user) {
    throw new Error("Credenciales inválidas.");
  }
  if (!user.Activo) {
    throw new Error(
      "Su cuenta ha sido desactivada. Contacte al administrador."
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
  if (!isPasswordValid) {
    throw new Error("Credenciales inválidas.");
  }

  const payload = {
    id: user.UsuarioID,
    email: user.Email,
    rol: user.Rol,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  delete user.PasswordHash;

  return { user, token };
};
