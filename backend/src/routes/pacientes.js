import express from "express";
import { getPool } from "../config/database.js";
import sql from "mssql";

const router = express.Router();

router.get("/", async (req, res) => {
  const { dni, nombre } = req.query;

  try {
    const pool = await getPool();
    const request = pool.request();

    let query = `
      SELECT
        P.*,
        OS.Nombre AS ObraSocialNombre
      FROM Pacientes P
      LEFT JOIN ObrasSociales OS ON P.ID_ObraSocial = OS.ID_ObraSocial
      WHERE P.Activo = 1
    `;

    if (dni) {
      query += " AND P.DNI LIKE @dni";
      request.input("dni", sql.VarChar, `%${dni}%`);
    }
    if (nombre) {
      query += " AND (P.Nombre LIKE @nombre OR P.Apellido LIKE @nombre)";
      request.input("nombre", sql.VarChar, `%${nombre}%`);
    }

    query += " ORDER BY P.Apellido, P.Nombre";

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener pacientes:", err);
    res
      .status(500)
      .json({ error: "Error al obtener pacientes", details: err.message });
  }
});

router.get("/search", async (req, res) => {
  const term = req.query.term || "";
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("searchTerm", `%${term}%`);

    const result = await request.query(`
      SELECT
        P.ID_Paciente, P.Nombre, P.Apellido, P.Telefono, P.DNI,
        OS.Nombre AS ObraSocialNombre
      FROM Pacientes P
      LEFT JOIN ObrasSociales OS ON P.ID_ObraSocial = OS.ID_ObraSocial
      WHERE (P.Nombre LIKE @searchTerm OR P.Apellido LIKE @searchTerm OR P.DNI LIKE @searchTerm)
      AND P.Activo = 1
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al buscar pacientes:", err);
    res.status(500).json([]);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("id", sql.Int, req.params.id);
    const result = await request.query(
      "SELECT * FROM Pacientes WHERE ID_Paciente = @id"
    );

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Paciente no encontrado" });
    }
  } catch (err) {
    console.error("Error al obtener el paciente:", err);
    res
      .status(500)
      .json({ error: "Error al obtener el paciente", details: err.message });
  }
});

router.post("/", async (req, res) => {
  const {
    Nombre,
    Apellido,
    DNI,
    Telefono,
    ID_ObraSocial,
    ID_Plan,
    NumeroAfiliado,
    Email,
    FechaNacimiento,
    Genero,
    EstadoCivil,
    Celular,
    Direccion,
    Ciudad,
    Provincia,
    CodigoPostal,
  } = req.body;

  try {
    const pool = await getPool();

    const checkDni = await pool
      .request()
      .input("DNI", sql.VarChar, DNI)
      .query("SELECT ID_Paciente FROM Pacientes WHERE DNI = @DNI");

    if (checkDni.recordset.length > 0) {
      return res.status(409).json({
        error: "Conflicto de Datos",
        details:
          "El DNI ingresado ya se encuentra registrado para otro paciente.",
      });
    }
    const request = pool.request();
    request.input("Nombre", sql.VarChar, Nombre);
    request.input("Apellido", sql.VarChar, Apellido);
    request.input("DNI", sql.VarChar, DNI);
    request.input("Telefono", sql.VarChar, Telefono);
    request.input("Email", sql.VarChar, Email);
    request.input("FechaNacimiento", sql.Date, FechaNacimiento || null);
    request.input("Genero", sql.VarChar, Genero);
    request.input("EstadoCivil", sql.VarChar, EstadoCivil);
    request.input("Celular", sql.VarChar, Celular);
    request.input("Direccion", sql.VarChar, Direccion);
    request.input("Ciudad", sql.VarChar, Ciudad);
    request.input("Provincia", sql.VarChar, Provincia);
    request.input("CodigoPostal", sql.VarChar, CodigoPostal);

    request.input("ID_ObraSocial", sql.Int, ID_ObraSocial || null);
    request.input("ID_Plan", sql.Int, ID_Plan || null);
    request.input("NumeroAfiliado", sql.VarChar, NumeroAfiliado || null);

    request.input("ObraSocial", sql.VarChar, null);
    request.input("PlanObraSocial", sql.VarChar, null);

    await request.query(`INSERT INTO Pacientes (
         Nombre, Apellido, DNI, Telefono, Email, FechaNacimiento, Genero,
         EstadoCivil, Celular, Direccion, Ciudad, Provincia, CodigoPostal,
         ID_ObraSocial, ID_Plan, NumeroAfiliado,
         ObraSocial, PlanObraSocial
       ) VALUES (
         @Nombre, @Apellido, @DNI, @Telefono, @Email, @FechaNacimiento, @Genero,
         @EstadoCivil, @Celular, @Direccion, @Ciudad, @Provincia, @CodigoPostal,
         @ID_ObraSocial, @ID_Plan, @NumeroAfiliado,
         @ObraSocial, @PlanObraSocial
       )`);
    res.status(201).json({ message: "Paciente registrado exitosamente" });
  } catch (err) {
    console.error("Error al registrar paciente:", err);
    res
      .status(500)
      .json({ error: "Error al registrar el paciente", details: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const {
    Nombre,
    Apellido,
    DNI,
    Telefono,
    ID_ObraSocial,
    ID_Plan,
    NumeroAfiliado,
    Email,
    FechaNacimiento,
    Genero,
    EstadoCivil,
    Celular,
    Direccion,
    Ciudad,
    Provincia,
    CodigoPostal,
  } = req.body;

  try {
    const pool = await getPool();
    const checkDni = await pool
      .request()
      .input("DNI", sql.VarChar, DNI)
      .input("id", sql.Int, req.params.id)
      .query(
        "SELECT ID_Paciente FROM Pacientes WHERE DNI = @DNI AND ID_Paciente != @id"
      );

    if (checkDni.recordset.length > 0) {
      return res.status(409).json({
        error: "Conflicto de Datos",
        details:
          "El DNI ingresado ya se encuentra registrado para otro paciente.",
      });
    }
    const request = pool.request();

    request.input("id", sql.Int, req.params.id);
    request.input("Nombre", sql.VarChar, Nombre);
    request.input("Apellido", sql.VarChar, Apellido);
    request.input("DNI", sql.VarChar, DNI);
    request.input("Telefono", sql.VarChar, Telefono);
    request.input("Email", sql.VarChar, Email);
    request.input("FechaNacimiento", sql.Date, FechaNacimiento || null);
    request.input("Genero", sql.VarChar, Genero);
    request.input("EstadoCivil", sql.VarChar, EstadoCivil);
    request.input("Celular", sql.VarChar, Celular);
    request.input("Direccion", sql.VarChar, Direccion);
    request.input("Ciudad", sql.VarChar, Ciudad);
    request.input("Provincia", sql.VarChar, Provincia);
    request.input("CodigoPostal", sql.VarChar, CodigoPostal);

    request.input("ID_ObraSocial", sql.Int, ID_ObraSocial || null);
    request.input("ID_Plan", sql.Int, ID_Plan || null);
    request.input("NumeroAfiliado", sql.VarChar, NumeroAfiliado || null);

    await request.query(`UPDATE Pacientes SET
            Nombre = @Nombre, Apellido = @Apellido, DNI = @DNI, Telefono = @Telefono, Email = @Email,
            FechaNacimiento = @FechaNacimiento, Genero = @Genero, EstadoCivil = @EstadoCivil, Celular = @Celular, Direccion = @Direccion,
            Ciudad = @Ciudad, Provincia = @Provincia, CodigoPostal = @CodigoPostal,
id            ID_ObraSocial = @ID_ObraSocial, ID_Plan = @ID_Plan, NumeroAfiliado = @NumeroAfiliado
           WHERE ID_Paciente = @id`);
    res.status(200).json({ message: "Paciente actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar paciente:", err);
    res
      .status(500)
      .json({ error: "Error al actualizar el paciente", details: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("id", sql.Int, req.params.id);

    await request.query(
      "UPDATE Pacientes SET Activo = 0 WHERE ID_Paciente = @id"
    );
    res.status(200).json({ message: "Paciente dado de baja exitosamente" });
  } catch (err) {
    console.error("Error al dar de baja al paciente:", err);
    res.status(500).json({
      error: "Error al dar de baja al paciente",
      details: err.message,
    });
  }
});
export default router;
