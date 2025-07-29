import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./RegistrarProveedor.css";

export const RegistrarProveedor = () => {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [barrio, setBarrio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const proveedor = location.state?.proveedor;

    if (proveedor) {
      setNombre(proveedor.nombre);
      setDireccion(proveedor.direccion);
      setBarrio(proveedor.barrio);
      setTelefono(proveedor.telefono);
      setEditandoId(proveedor.id);
    } else if (location.pathname === "/proveedores/actualizar") {
      alert("No se encontró ningún proveedor para editar.");
      navigate("/proveedores/consultar");
    }
  }, [location, navigate]);

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

    const url = editandoId
      ? `http://localhost:3000/proveedores/${editandoId}`
      : "http://localhost:3000/proveedores";
    const method = editandoId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, direccion, barrio, telefono }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar proveedor");
        return res.json();
      })
      .then(() => {
        setNombre("");
        setDireccion("");
        setBarrio("");
        setTelefono("");
        setEditandoId(null);
        alert("Proveedor guardado correctamente");
        navigate("/proveedores/consultar");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="registro-proveedor">
      <h2>{editandoId ? "Editar" : "Registrar"} Proveedor</h2>
      <form onSubmit={handleSubmit} className="form-proveedor">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Barrio:</label>
          <input
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
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
