import * as authService from "../services/authService.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "El correo y la contraseña son obligatorios." });
  }

  try {
    const { user, token } = await authService.loginUser(email, password);
    res.status(200).json({ message: "Login exitoso", user, token });
  } catch (error) {
    // Usamos 401 para errores de autenticación
    res.status(401).json({ message: error.message });
  }
};
