import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ListadoProveedores.css";

export const ListadoProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [filtro, setFiltro] = useState(""); // ✅ ESTADO DECLARADO ACÁ
  const navigate = useNavigate();

  const obtenerProveedores = () => {
    fetch("http://localhost:3000/proveedores")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => console.error("Error al obtener proveedores:", err));
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const proveedoresFiltrados = proveedores.filter((p) => {
    const textoFiltro = filtro.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(textoFiltro) ||
      p.barrio.toLowerCase().includes(textoFiltro)
    );
  });

  const handleEditar = (proveedor) => {
    navigate(`/proveedores/actualizar/${proveedor.id}`);
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;

    fetch(`http://localhost:3000/proveedores/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar proveedor");
        obtenerProveedores();
      })
      .catch((err) => alert(err.message));
  };

  const exportarAExcel = () => {
    const datosSinId = proveedores.map(({ id, ...resto }) => resto);
    const hoja = XLSX.utils.json_to_sheet(datosSinId);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Proveedores");
    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const archivo = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(archivo, "Proveedores.xlsx");
  };

  const exportarAPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Listado de Proveedores", 14, 20);

    const columnas = ["Nombre", "Dirección", "Barrio", "Teléfono"];
    const filas = proveedores.map((p) => [
      p.nombre,
      p.direccion,
      p.barrio,
      p.telefono,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [columnas],
      body: filas,
      styles: {
        fontSize: 10,
        halign: "left",
        valign: "middle",
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 10 },
    });

    doc.save("Proveedores.pdf");
  };

  return (
    <div className="listado-proveedores">
      <h2>Listado de Proveedores</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o barrio..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <div className="botones-exportacion">
        <button onClick={exportarAExcel} className="btn-excel">
          📥 Exportar a Excel
        </button>
        <button onClick={exportarAPDF} className="btn-pdf">
          🧾 Exportar a PDF
        </button>
      </div>

      <table className="tabla-categorias">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Barrio</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedoresFiltrados.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.direccion}</td>
              <td>{p.barrio}</td>
              <td>{p.telefono}</td>
              <td>
                <button onClick={() => handleEditar(p)} className="btn-editar">
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(p.id)}
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
