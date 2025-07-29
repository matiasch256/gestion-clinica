import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleProducto.css";

export function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/productos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducto(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar el detalle del producto:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!producto) return <p>No se encontró el producto</p>;

  return (
    <div className="detalle-producto">
      <h2>Detalle del Producto</h2>

      <p>
        <strong>ID:</strong> {producto.id}
      </p>
      <p>
        <strong>Nombre:</strong> {producto.nombre}
      </p>
      <p>
        <strong>Descripción:</strong> {producto.descripcion}
      </p>
      <p>
        <strong>Código:</strong> {producto.codigo}
      </p>
      <p>
        <strong>Unidad de Medida:</strong> {producto.unidadMedida}
      </p>
      <p>
        <strong>Stock:</strong> {producto.stock}
      </p>
      <p>
        <strong>Stock Mínimo:</strong> {producto.stockMinimo}
      </p>
      <p>
        <strong>Observaciones:</strong>{" "}
        {producto.observaciones || "Sin observaciones"}
      </p>
      <p>
        <strong>Estado:</strong> {producto.activo ? "Activo" : "Inactivo"}
      </p>
      <p>
        <strong>Categoría ID:</strong> {producto.categoriaId}
      </p>

      <button className="volver" onClick={() => navigate(-1)}>
        ⬅️ Volver
      </button>
    </div>
  );
}

export default DetalleProducto;
