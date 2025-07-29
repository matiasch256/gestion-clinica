import "./Form.css";
import Logo from "./Logo/Logo.png";
import { Navbar } from "../../layouts/navbar/Navbar";
import { Footer } from "../../layouts/footer/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";

export const Form = ({ formToggle, formTitle, submitButtonText }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "laura_barrancas@gmail.com" && password === "12341234") {
      let nombreSesion = "Laura";
      login(nombreSesion);
      navigate("/home"); // Redirige a la ruta "/compras"
    } else {
      alert("Credenciales incorrectas"); // Muestra una alerta si las credenciales son incorrectas
      // Aquí podrías agregar lógica para mostrar un mensaje de error en el formulario
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-form-container">
        <div className="login-form-logo">
          <img src={Logo} alt="Logo de la empresa" />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="username-input">Usuario</label>
            <input
              type="text"
              id="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Actualiza el estado username
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password-input">Password</label>
            <input
              type="password"
              id="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado password
            />
          </div>
          <button type="submit" className="login-form-button">
            {submitButtonText || "Enviar"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};
