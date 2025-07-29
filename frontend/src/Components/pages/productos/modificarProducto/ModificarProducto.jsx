import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ModificarProducto.css";

export function ModificarProducto() {
  const { idProducto } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3000/api/productos/${idProducto}`)
      .then((res) => res.json())
      .then((data) => {
        setProducto(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
        setLoading(false);
      });

    fetch("http://localhost:3000/api/categorias")
      .then((res) => res.json())
      .then(setCategorias)
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, [idProducto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!producto.nombre.trim()) nuevosErrores.nombre = true;
    if (!producto.descripcion.trim()) nuevosErrores.descripcion = true;
    if (!producto.codigo.trim()) nuevosErrores.codigo = true;
    if (!producto.unidadMedida.trim()) nuevosErrores.unidadMedida = true;
    if (
      producto.stock === "" ||
      isNaN(producto.stock) ||
      Number(producto.stock) < 0
    )
      nuevosErrores.stock = true;
    if (
      producto.stockMinimo === "" ||
      isNaN(producto.stockMinimo) ||
      Number(producto.stockMinimo) <= 0
    )
      nuevosErrores.stockMinimo = true;
    if (!producto.categoriaId) nuevosErrores.categoriaId = true;
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!producto.nombre.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    if (!producto.descripcion.trim()) {
      alert("La descripción es obligatoria.");
      return;
    }

    if (!producto.codigo.trim()) {
      alert("El código es obligatorio.");
      return;
    }

    if (!producto.unidadMedida.trim()) {
      alert("La unidad de medida es obligatoria.");
      return;
    }

    if (
      producto.stock === "" ||
      isNaN(producto.stock) ||
      Number(producto.stock) < 0
    ) {
      alert("El stock debe ser un número mayor o igual a 0.");
      return;
    }

    if (
      producto.stockMinimo === "" ||
      isNaN(producto.stockMinimo) ||
      Number(producto.stockMinimo) <= 0
    ) {
      alert("El stock mínimo debe ser un número mayor a 0.");
      return;
    }

    if (!producto.categoriaId) {
      alert("Debe seleccionar una categoría.");
      return;
    }

    // Enviar datos si todo está bien
    try {
      const res = await fetch(
        `http://localhost:3000/api/productos/${idProducto}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(producto),
        }
      );

      if (res.ok) {
        alert("Producto actualizado correctamente");
        navigate("/productos/lista");
      } else {
        alert("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error al enviar la actualización:", error);
    }
  };

  if (loading || !producto) return <p>Cargando...</p>;

  return (
    <div className="modificar-producto">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={producto.nombre}
          onChange={handleChange}
          className={errores.nombre ? "input-error" : ""}
        />

        <label>Descripción:</label>
        <input
          type="text"
          name="descripcion"
          value={producto.descripcion}
          onChange={handleChange}
          className={errores.descripcion ? "input-error" : ""}
        />

        <label>Código:</label>
        <input
          type="text"
          name="codigo"
          value={producto.codigo}
          onChange={handleChange}
          className={errores.codigo ? "input-error" : ""}
        />

        <label>Unidad de Medida:</label>
        <input
          type="text"
          name="unidadMedida"
          value={producto.unidadMedida}
          onChange={handleChange}
          className={errores.unidadMedida ? "input-error" : ""}
        />

        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={producto.stock}
          onChange={handleChange}
          className={errores.stock ? "input-error" : ""}
        />

        <label>Stock Mínimo:</label>
        <input
          type="number"
          name="stockMinimo"
          value={producto.stockMinimo}
          onChange={handleChange}
          className={errores.stockMinimo ? "input-error" : ""}
        />

        <label>Observaciones:</label>
        <input
          type="text"
          name="observaciones"
          value={producto.observaciones}
          onChange={handleChange}
          className="full-width"
        />

        <label>Categoría:</label>
        <select
          name="categoriaId"
          value={producto.categoriaId}
          onChange={handleChange}
          className={errores.categoriaId ? "input-error" : ""}
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <label>Activo:</label>
        <select name="activo" value={producto.activo} onChange={handleChange}>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>

        <div
          className="full-width"
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
          <button type="submit">💾 Guardar cambios</button>
          <button type="button" onClick={() => navigate(-1)}>
            ⬅️ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModificarProducto;
