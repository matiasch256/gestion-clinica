import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./RegistrarCategoria.css";

export const RegistrarCategoria = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const categoria = location.state?.categoria;
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion);
      setEditandoId(categoria.id);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre.trim() || !descripcion.trim()) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (!isNaN(nombre)) {
      alert("El nombre no puede ser un número.");
      return;
    }

    const url = editandoId
      ? `http://localhost:3000/categorias/${editandoId}`
      : "http://localhost:3000/categorias";
    const method = editandoId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar categoría");
        return res.json();
      })
      .then(() => {
        setNombre("");
        setDescripcion("");
        setEditandoId(null);
        alert("Categoría guardada correctamente");
        navigate("/categorias/consultar");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="registro-categoria">
      <h2>{editandoId ? "Editar" : "Registrar"} Categoría</h2>
      <form onSubmit={handleSubmit} className="form-categoria">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="registrar-btn">
          {editandoId ? "Actualizar" : "Registrar"}
        </button>
      </form>
    </div>
  );
};
