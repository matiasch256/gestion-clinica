import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ActualizarProveedor.css";

export const ActualizarProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [barrio, setBarrio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/proveedores/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener proveedor");
        return res.json();
      })
      .then((data) => {
        setNombre(data.nombre);
        setDireccion(data.direccion);
        setBarrio(data.barrio);
        setTelefono(data.telefono);
        setCargando(false);
      })
      .catch((err) => {
        alert(err.message);
        setCargando(false);
        navigate("/proveedores/consultar");
      });
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (
      !nombre.trim() ||
      !direccion.trim() ||
      !barrio.trim() ||
      !telefono.trim()
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (!isNaN(nombre)) {
      alert("El nombre no puede ser solo números.");
      return;
    }

    fetch(`http://localhost:3000/proveedores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, direccion, barrio, telefono }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar proveedor");
        alert("Proveedor actualizado con éxito");
        navigate("/proveedores/consultar");
      })
      .catch((err) => alert(err.message));
  };

  if (cargando) return <p>Cargando datos del proveedor...</p>;

  return (
    <div className="actualizar-proveedor">
      <h2>Actualizar Proveedor</h2>
      <form onSubmit={handleSubmit} className="form-proveedor">
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
          <label>Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Barrio:</label>
          <input
            type="text"
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="actualizar-btn">
          Actualizar Proveedor
        </button>
      </form>
    </div>
  );
};
