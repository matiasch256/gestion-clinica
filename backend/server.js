const express = require("express");
const cors = require("cors");
require("dotenv").config();

const proveedoresRoutes = require("./routes/proveedores");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/proveedores", proveedoresRoutes);

//#endregion

// #region ------ Función para validar y normalizar fechas ------
const normalizeDate = (dateString) => {
  if (!dateString) return null;
  // Verificar si la fecha ya está en formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  // Manejar formatos DD/M/YYYY o DD/MM/YYYY
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return null;
};

sql
  .connect(config)
  .then((pool) => {
    console.log("✅ Conexión exitosa a SQL Server con usuario y contraseña");
  })
  .catch((err) => {
    console.error("❌ Error al conectar a la base de datos:", err);
  });
//#endregion

// #region ------ PROVEEDORES ------
app.get("/proveedores", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM proveedores");
    res.json(result.recordset);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).send("Error en el servidor");
  }
});

app.get("/proveedores/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT * FROM proveedores WHERE id = ${id}
    `;

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Proveedor no encontrado" });
    }
  } catch (err) {
    console.error("❌ Error al consultar proveedor:", err.message);
    res
      .status(500)
      .json({ error: `Error al consultar proveedor: ${err.message}` });
  }
});

app.post("/proveedores", async (req, res) => {
  const { nombre, direccion, barrio, telefono } = req.body;

  try {
    await sql.connect(config);
    const result = await sql.query`
        INSERT INTO proveedores (nombre, direccion, barrio, telefono)
        VALUES (${nombre}, ${direccion}, ${barrio}, ${telefono})
      `;
    res.status(200).json({ message: "Proveedor registrado", result });
  } catch (err) {
    console.error("❌ Error al insertar proveedor:", err);
    res.status(500).json({ error: "Error al registrar proveedor" });
  }
});

app.delete("/proveedores/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Eliminando proveedor con ID: ${id}`);
  try {
    await sql.connect(config);
    const result = await sql.query`
      DELETE FROM proveedores
      WHERE id = ${id}
    `;
    console.log(`Resultado de la eliminación:`, result);
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Proveedor eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Proveedor no encontrado" });
    }
  } catch (err) {
    console.error("❌ Error al eliminar proveedor:", err);
    res.status(500).json({ error: "Error al eliminar proveedor" });
  }
});

app.put("/proveedores/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, barrio, telefono } = req.body;

  try {
    await sql.connect(config);
    const result = await sql.query`
      UPDATE proveedores
      SET nombre = ${nombre},
          direccion = ${direccion},
          barrio = ${barrio},
          telefono = ${telefono}
      WHERE id = ${id}
    `;
    res.status(200).json({ message: "Proveedor actualizado", result });
  } catch (err) {
    console.error("❌ Error al actualizar proveedor:", err);
    res.status(500).json({ error: "Error al actualizar proveedor" });
  }
});
//#endregion

// #region ------ COMPRAS ------
app.post("/api/compras", async (req, res) => {
  const { proveedor, fecha, productos } = req.body;

  try {
    await sql.connect(config);
    console.log("Conectado a la base de datos");

    // Validar y normalizar la fecha
    const normalizedDate = normalizeDate(fecha);
    if (!normalizedDate) {
      return res.status(400).json({ error: "Formato de fecha inválido" });
    }

    // Insertar la compra principal
    const compraResult = await sql.query`
      INSERT INTO Compras (proveedor, fecha)
      OUTPUT INSERTED.id
      VALUES (${proveedor}, ${normalizedDate})
    `;

    const compraId = compraResult.recordset[0].id;

    // Insertar los productos de la compra
    for (const p of productos) {
      console.log("Producto:", p);
      await sql.query`
        INSERT INTO DetalleCompra (IdCompra, NombreProducto, Cantidad, Precio)
        VALUES (${compraId}, ${p.nombre}, ${p.cantidad}, ${p.precio})
      `;
    }

    res.status(200).json({ message: "Compra registrada correctamente" });
  } catch (error) {
    console.error("Error al registrar la compra:", error);
    res.status(500).json({ error: "Error al registrar la compra" });
  }
});

app.get("/api/compras", async (req, res) => {
  try {
    await sql.connect(config);

    // Obtener todas las compras, formateando la fecha como YYYY-MM-DD
    const comprasResult = await sql.query(`
      SELECT C.id, C.proveedor, CONVERT(VARCHAR, C.fecha, 23) AS fecha, P.nombre AS proveedorNombre
      FROM Compras C
      JOIN Proveedores P ON C.proveedor = P.id
    `);

    const compras = comprasResult.recordset;

    // Para cada compra, obtener sus productos
    for (let compra of compras) {
      const detallesResult = await sql.query`
        SELECT * FROM DetalleCompra WHERE IdCompra = ${compra.id}
      `;
      compra.productos = detallesResult.recordset;
    }

    // Log para depurar las compras devueltas
    console.log("Compras devueltas:", JSON.stringify(compras, null, 2));

    res.status(200).json(compras);
  } catch (error) {
    console.error("Error al obtener las compras:", error);
    res.status(500).json({ error: "Error al obtener las compras" });
  }
});

app.get("/api/compras/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(config);

    // Obtener la compra por ID, formateando la fecha
    const compraResult = await sql.query(`
      SELECT C.id, C.proveedor, CONVERT(VARCHAR, C.fecha, 23) AS fecha, P.nombre AS proveedorNombre
      FROM Compras C
      JOIN Proveedores P ON C.proveedor = P.id
      WHERE C.id = ${id}
    `);
    const compra = compraResult.recordset[0];

    if (!compra) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    // Obtener los productos de la compra
    const detallesResult = await sql.query`
      SELECT * FROM DetalleCompra WHERE IdCompra = ${id}
    `;
    compra.productos = detallesResult.recordset;

    res.status(200).json(compra);
  } catch (error) {
    console.error("Error al obtener la compra:", error);
    res.status(500).json({ error: "Error al obtener la compra" });
  }
});

app.put("/api/compras/:id", async (req, res) => {
  const { id } = req.params;
  const { proveedor, fecha, productos } = req.body;

  try {
    await sql.connect(config);

    // Validar y normalizar la fecha
    const normalizedDate = normalizeDate(fecha);
    if (!normalizedDate) {
      return res.status(400).json({ error: "Formato de fecha inválido" });
    }

    // Verificar si la compra existe
    const resultCompra = await sql.query`
      SELECT * FROM Compras WHERE id = ${id}
    `;
    if (resultCompra.recordset.length === 0) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    // Actualizar la cabecera de la compra
    await sql.query`
      UPDATE Compras
      SET proveedor = ${proveedor}, fecha = ${normalizedDate}
      WHERE id = ${id}
    `;

    // Eliminar los productos existentes para esa compra
    await sql.query`
      DELETE FROM DetalleCompra WHERE IdCompra = ${id}
    `;

    // Insertar los nuevos productos
    for (const p of productos) {
      await sql.query`
        INSERT INTO DetalleCompra (IdCompra, NombreProducto, Cantidad, Precio)
        VALUES (${id}, ${p.NombreProducto}, ${p.Cantidad}, ${p.Precio})
      `;
    }

    res.status(200).json({ message: "Compra actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la compra:", error);
    res.status(500).json({ error: "Error al actualizar la compra" });
  }
});

app.delete("/api/compras/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(config);

    // Verificar si existe la compra
    const compraExistente = await sql.query`
      SELECT * FROM Compras WHERE id = ${id}
    `;
    if (compraExistente.recordset.length === 0) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    // Eliminar productos de la compra
    await sql.query`
      DELETE FROM DetalleCompra WHERE IdCompra = ${id}
    `;

    // Eliminar la compra
    await sql.query`
      DELETE FROM Compras WHERE id = ${id}
    `;

    res.status(200).json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la compra:", error);
    res.status(500).json({ error: "Error al eliminar la compra" });
  }
});

app.get("/api/cantidad-compras", async (req, res) => {
  let pool;
  try {
    // Obtener parámetros de la query
    const topN = parseInt(req.query.topN) || 10; // Por defecto Top 10 si no se especifica
    const periodo = req.query.periodo || "anual"; // Por defecto anual si no se especifica

    // Validar topN
    if (![5, 10].includes(topN)) {
      return res.status(400).json({ error: "topN debe ser 5 o 10" });
    }

    // Calcular la fecha de inicio según el período
    let startDate;
    const currentDate = new Date();
    if (periodo === "mensual") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    } else if (periodo === "trimestral") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
    } else if (periodo === "semestral") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    } else if (periodo === "anual") {
      startDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() - 1)
      );
    } else {
      return res.status(400).json({ error: "Período inválido" });
    }

    pool = await sql.connect(config);

    // Consulta parametrizada
    const query = `
      SELECT TOP (@topN) d.NombreProducto, SUM(d.Cantidad) AS TotalCantidad
      FROM DetalleCompra d
      INNER JOIN Compras c ON d.IdCompra = c.id
      WHERE c.fecha >= @startDate
      GROUP BY d.NombreProducto
      ORDER BY SUM(d.Cantidad) DESC
    `;

    const request = pool.request();
    request.input("topN", sql.Int, topN);
    request.input("startDate", sql.Date, startDate);

    const result = await request.query(query);
    res.status(200).json(result.recordset);
    console.log("Resultado de la consulta:", result.recordset);
  } catch (error) {
    console.error("Error en la consulta:", error.message, error.stack);
    res.status(500).json({
      error: "Error en la consulta",
      details: error.message,
      sqlMessage: error.originalError
        ? error.originalError.info.message
        : "No SQL message",
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});
// #endregion

// #region ------ USUARIOS ------
app.post("/api/usuarios", async (req, res) => {
  const { nombre, email } = req.body;
  try {
    await sql.connect(config);
    await sql.query`INSERT INTO PruebaUsuarios (nombre, email) VALUES (${nombre}, ${email})`;
    res.send({ success: true, mensaje: "Usuario guardado" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});
//#endregion

// #region ------ PRODUCTOS ------
app.get("/api/productos", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM productos`;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

app.get("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM productos WHERE id = ${id}`;
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

//INSERTAR PRODUCTOS
app.post("/api/productos", async (req, res) => {
  const { nombre, descripcion, unidadMedida, stock, stockMinimo } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO productos (nombre, descripcion, unidadMedida, stock, stockMinimo)
      VALUES (${nombre}, ${descripcion}, ${unidadMedida}, ${stock}, ${stockMinimo})
    `;
    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    codigo,
    unidadMedida,
    stock,
    stockMinimo,
    observaciones,
    activo,
  } = req.body;

  try {
    await sql.connect(config);
    const result = await sql.query`
      UPDATE productos
      SET nombre = ${nombre},
          descripcion = ${descripcion},
          codigo = ${codigo},
          unidadMedida = ${unidadMedida},
          stock = ${stock},
          stockMinimo = ${stockMinimo},
          observaciones = ${observaciones},
          activo = ${activo}
      WHERE id = ${id}
    `;
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Producto actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

app.delete("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query`DELETE FROM productos WHERE id = ${id}`;
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// #endregion

// #region ------ CATEGORIAS ------
app.get("/api/categorias", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM categorias`;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

app.get("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM categorias WHERE id = ${id}`;
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Categoría no encontrada" });
    }
  } catch (error) {
    console.error("❌ Error al obtener categoría:", error);
    res.status(500).json({ error: "Error al obtener categoría" });
  }
});

app.post("/categorias", async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO categorias (nombre, descripcion)
      VALUES (${nombre}, ${descripcion})
    `;
    res.status(201).json({ message: "Categoría creada correctamente" });
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear categoría" });
  }
});

app.put("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    await sql.connect(config);
    const result = await sql.query`
      UPDATE categorias
      SET nombre = ${nombre}, descripcion = ${descripcion}
      WHERE id = ${id}
    `;
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Categoría actualizada correctamente" });
    } else {
      res.status(404).json({ error: "Categoría no encontrada" });
    }
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
});

app.delete("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query`DELETE FROM categorias WHERE id = ${id}`;
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Categoría eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Categoría no encontrada" });
    }
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
});

// #endregion

// #region ------ GASTOS ------
app.get("/api/gastos", async (req, res) => {
  const { periodo = "mensual", startYear, endYear } = req.query;

  try {
    await sql.connect(config);

    let query;
    let whereClause = "";
    if (startYear && endYear) {
      whereClause = `WHERE YEAR(C.fecha) BETWEEN ${startYear} AND ${endYear}`;
    } else if (startYear) {
      whereClause = `WHERE YEAR(C.fecha) >= ${startYear}`;
    } else if (endYear) {
      whereClause = `WHERE YEAR(C.fecha) <= ${endYear}`;
    }

    if (periodo === "mensual") {
      query = `
        SELECT 
          FORMAT(C.fecha, 'yyyy-MM') AS periodo,
          SUM(DC.Precio * DC.Cantidad) AS total_gastado
        FROM Compras C
        JOIN DetalleCompra DC ON C.id = DC.IdCompra
        ${whereClause}
        GROUP BY FORMAT(C.fecha, 'yyyy-MM')
        ORDER BY periodo
      `;
    } else if (periodo === "trimestral") {
      query = `
        SELECT 
          CONCAT(YEAR(C.fecha), '-Q', DATEPART(QUARTER, C.fecha)) AS periodo,
          SUM(DC.Precio * DC.Cantidad) AS total_gastado
        FROM Compras C
        JOIN DetalleCompra DC ON C.id = DC.IdCompra
        ${whereClause}
        GROUP BY YEAR(C.fecha), DATEPART(QUARTER, C.fecha)
        ORDER BY YEAR(C.fecha), DATEPART(QUARTER, C.fecha)
      `;
    } else if (periodo === "anual") {
      query = `
        SELECT 
          CAST(YEAR(C.fecha) AS NVARCHAR) AS periodo,
          SUM(DC.Precio * DC.Cantidad) AS total_gastado
        FROM Compras C
        JOIN DetalleCompra DC ON C.id = DC.IdCompra
        ${whereClause}
        GROUP BY YEAR(C.fecha)
        ORDER BY YEAR(C.fecha)
      `;
    } else {
      return res.status(400).json({ error: "Período no válido" });
    }

    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error(`Error al obtener gastos por ${periodo}:`, error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});
//#endregion

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
