import React, { useState } from "react";
import axios from "axios";

export const Usuario = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const enviarDatos = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/usuarios", {
        nombre,
        email,
      });
      alert(res.data.mensaje);
    } catch (err) {
      alert("Error al guardar");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Formulario de Prueba</h1>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <br />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <button onClick={enviarDatos}>Guardar</button>
    </div>
  );
};
