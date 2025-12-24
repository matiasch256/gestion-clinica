import { useEffect, useState } from "react";
import "./ConsultarCompras.css";

export const ConsultarCompras = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/compras")
      .then((res) => res.json())
      .then((data) => {
        setCompras(data);
        console.log("Compras obtenidas:", data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener compras:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="consulta-compras">
      <h2>Consultar Compras</h2>
      {loading ? (
        <p>Cargando compras...</p>
      ) : compras.length === 0 ? (
        <p>No hay compras registradas.</p>
      ) : (
        <table className="compras-table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra, index) => {
              const total = compra.productos.reduce(
                (acc, p) => acc + p.Cantidad * p.Precio,
                0
              );

              return (
                <tr key={index}>
                  <td>{compra.proveedor}</td>
                  <td>{compra.fecha}</td>
                  <td>${total.toFixed(2)}</td>
                  <td>
                    <ul>
                      {compra.productos.map((p, i) => (
                        <li key={i}>
                          {p.NombreProducto.toUpperCase()} = {p.Cantidad} x $
                          {p.Precio}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
