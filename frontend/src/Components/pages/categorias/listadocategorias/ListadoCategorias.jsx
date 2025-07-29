import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListadoCategorias.css";

export const ListadoCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState(""); // estado para filtro
  const navigate = useNavigate();

  const obtenerCategorias = () => {
    fetch("http://localhost:3000/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al obtener categorías:", err));
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const handleEditar = (categoria) => {
    navigate(`/categorias/actualizar/${categoria.id}`);
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    fetch(`http://localhost:3000/categorias/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar categoría");
        obtenerCategorias();
      })
      .catch((err) => alert(err.message));
  };

  // filtro aplicado sobre categorias
  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="listado-categorias">
      <h2>Listado de Categorías</h2>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <table className="tabla-categorias">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categoriasFiltradas.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.descripcion}</td>
              <td>
                <button onClick={() => handleEditar(c)}>Editar</button>
                <button onClick={() => handleEliminar(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};