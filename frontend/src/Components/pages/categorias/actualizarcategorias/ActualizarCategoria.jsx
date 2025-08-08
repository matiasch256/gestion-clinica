import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ActualizarCategoria.css";

export const ActualizarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/categorias/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener categoría");
        return res.json();
      })
      .then((data) => {
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setCargando(false);
      })
      .catch((err) => {
        alert(err.message);
        setCargando(false);
        navigate("/categorias/consultar");
      });
  }, [id, navigate]);

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

    fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar categoría");
        alert("Categoría actualizada con éxito");
        navigate("/categorias/consultar");
      })
      .catch((err) => alert(err.message));
  };

  if (cargando) return <p>Cargando datos de la categoría...</p>;

  return (
    <div className="actualizar-categoria">
      <h2>Actualizar Categoría</h2>
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
        <button type="submit" className="actualizar-btn">
          Actualizar Categoría
        </button>
      </form>
    </div>
  );
};
