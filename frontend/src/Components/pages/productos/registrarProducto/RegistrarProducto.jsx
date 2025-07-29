import { useEffect, useState } from "react";
import "./RegistrarProducto.css";

export const RegistrarProducto = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [errores, setErrores] = useState({
    nombre: false,
    descripcion: false,
    unidadMedida: false,
    stock: false,
    stockMinimo: false,
    categoriaSeleccionada: false,
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data);
        console.log("Categorías obtenidas:", data);
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
        alert("Hubo un error al obtener las categorías");
      });
  }, []);

  const validarCampos = () => {
    const stockNum = parseInt(stock);
    const stockMinimoNum = parseInt(stockMinimo);

    let nuevosErrores = {
      nombre: !nombre.trim(),
      descripcion: !descripcion.trim(),
      unidadMedida: !unidadMedida.trim(),
      stock: isNaN(stockNum) || stockNum < 0,
      stockMinimo: isNaN(stockMinimoNum) || stockMinimoNum <= 0,
      categoriaSeleccionada: !categoriaSeleccionada,
    };

    setErrores(nuevosErrores);

    return !Object.values(nuevosErrores).some((error) => error);
  };

  const registrarProducto = () => {
    if (!validarCampos()) {
      alert("Por favor completa todos los campos correctamente.");
      return;
    }

    const nuevoProducto = {
      nombre,
      descripcion,
      unidadMedida,
      stock: parseInt(stock),
      stockMinimo: parseInt(stockMinimo),
      categoria: categoriaSeleccionada,
    };

    fetch("http://localhost:3000/api/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoProducto),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        alert("Producto registrado exitosamente");
        setNombre("");
        setDescripcion("");
        setUnidadMedida("");
        setStock("");
        setStockMinimo("");
        setCategoriaSeleccionada("");
        setErrores({
          nombre: false,
          descripcion: false,
          unidadMedida: false,
          stock: false,
          stockMinimo: false,
          categoriaSeleccionada: false,
        });
        console.log("Producto registrado:", data);
      })
      .catch((error) => {
        console.error("Error al registrar producto:", error);
        alert("Hubo un error al registrar el producto");
      });
  };

  return (
    <div className="registro-producto">
      <h2>Registrar Producto</h2>
      <div className="form-group">
        <label>Nombre del Producto:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setErrores((prev) => ({ ...prev, nombre: false }));
          }}
          className={errores.nombre ? "error" : ""}
        />
      </div>
      <div className="form-group">
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => {
            setDescripcion(e.target.value);
            setErrores((prev) => ({ ...prev, descripcion: false }));
          }}
          className={errores.descripcion ? "error" : ""}
        />
      </div>
      <div className="form-group">
        <label>Unidad de Medida:</label>
        <input
          type="text"
          value={unidadMedida}
          onChange={(e) => {
            setUnidadMedida(e.target.value);
            setErrores((prev) => ({ ...prev, unidadMedida: false }));
          }}
          className={errores.unidadMedida ? "error" : ""}
        />
      </div>
      <div className="form-group">
        <label>Stock Inicial:</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);
            setErrores((prev) => ({ ...prev, stock: false }));
          }}
          className={errores.stock ? "error" : ""}
          min="0"
        />
      </div>
      <div className="form-group">
        <label>Stock Mínimo:</label>
        <input
          type="number"
          value={stockMinimo}
          onChange={(e) => {
            setStockMinimo(e.target.value);
            setErrores((prev) => ({ ...prev, stockMinimo: false }));
          }}
          className={errores.stockMinimo ? "error" : ""}
          min="1"
        />
      </div>
      <div className="form-group">
        <label>Categoría:</label>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => {
            setCategoriaSeleccionada(e.target.value);
            setErrores((prev) => ({ ...prev, categoriaSeleccionada: false }));
          }}
          className={errores.categoriaSeleccionada ? "error" : ""}
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>
      <button className="registrar-btn" onClick={registrarProducto}>
        Registrar Producto
      </button>
    </div>
  );
};
