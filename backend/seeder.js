/*
 * SCRIPT DE SEEDING (POBLADO) V6 - MDMSYSTEM
 * ---------------------------------------------
 * CORREGIDO: Reemplaza 'lorem.sentence' por una descripción
 * de producto realista en español.
 * CORREGIDO: Limpiado de todos los artefactos de código (s, iOS, etc.)
 *
 * CÓMO USAR:
 * 1. Asegúrate de que tu BD esté corriendo.
 * 2. Detén tu servidor de backend (node server.js).
 * 3. Ejecuta desde la terminal: node seeder.js
 */

import "./src/config/env.js";
import { validateEnvVars } from "./src/config/validateEnv.js";
validateEnvVars();

import { Faker, es } from "@faker-js/faker";
import { getPool } from "./src/config/database.js";
import sql from "mssql";

const PROVEEDORES_A_CREAR = 10;
const PRODUCTOS_A_CREAR = 50;
const PACIENTES_A_CREAR = 150;
const TURNOS_A_CREAR = 1000;

const FECHA_HOY = new Date();
const FECHA_HACE_UN_ANO = new Date(
  new Date().setFullYear(FECHA_HOY.getFullYear() - 1)
);
const faker = new Faker({ locale: [es] });

const BARRIOS_CABA = [
  "Palermo",
  "Recoleta",
  "Belgrano",
  "Caballito",
  "Villa Urquiza",
  "San Nicolás",
  "Flores",
  "Almagro",
  "Nuñez",
  "Saavedra",
];
const CIUDAD = "CABA";
const PROVINCIA = "Buenos Aires";

const NOMBRES_PRODUCTOS_MEDICOS = [
  "Bisturí Descartable N°10",
  "Bisturí Descartable N°15",
  "Guantes de Látex (M)",
  "Guantes de Látex (L)",
  "Sutura Nylon 3-0",
  "Sutura Catgut 2-0",
  "Gasa Estéril 10x10cm (Sobre)",
  "Solución Fisiológica 500ml",
  "Pervinox (Yodo-Povidona) 100ml",
  "Jeringa Descartable 5ml",
  "Jeringa Descartable 10ml",
  "Agujas Hipodérmicas 21G",
  "Agujas Hipodérmicas 25G",
  "Campo Quirúrgico Estéril 50x50",
  "Alcohol Etílico 70% 500ml",
  "Algodón Hidrófilo 500g",
  "Venda Elástica 10cm",
  "Tela Adhesiva Hipoalergénica",
  "Catéter Intravenoso N°20",
  "Catéter Intravenoso N°22",
  "Barbijos Quirúrgicos (Caja x50)",
];

/**
 * ORQUESTADOR PRINCIPAL
 */
async function runSeeder() {
  let pool;
  let transaction;
  console.log("🌱 Iniciando el script de seeder V6 (corregido)...");
  console.log(
    `Generando datos de prueba entre ${FECHA_HACE_UN_ANO.toLocaleDateString()} y ${FECHA_HOY.toLocaleDateString()}`
  );

  try {
    pool = await getPool();
    transaction = pool.transaction();
    await transaction.begin();

    console.log("\n--- FASE 1: LEYENDO DATOS MAESTROS ---");
    const masterData = await loadMasterData(transaction);
    if (!masterData) {
      throw new Error("No se pudieron cargar los datos maestros. Abortando.");
    }

    console.log("\n--- FASE 2: CREANDO DATOS NUEVOS ---");
    await createProveedores(transaction, PROVEEDORES_A_CREAR);
    await createProductos(transaction, PRODUCTOS_A_CREAR, masterData);
    const nuevosPacienteIDs = await createPacientes(
      transaction,
      PACIENTES_A_CREAR,
      masterData
    );

    console.log("\n--- FASE 3: VINCULANDO DATOS (TURNOS Y FACTURAS) ---");
    const todosPacienteIDs = [...masterData.pacientes, ...nuevosPacienteIDs];
    await createTurnos(
      transaction,
      TURNOS_A_CREAR,
      todosPacienteIDs,
      masterData
    );
    await createFacturasYDetalles(transaction, masterData);

    await transaction.commit();
    console.log("\n✅ ¡Seeding completado exitosamente!");
    console.log(
      "Tu base de datos ahora tiene datos realistas para el último año."
    );
  } catch (err) {
    console.error("❌ ERROR durante el seeding:", err.message);
    if (transaction) {
      console.log("Rollback de la transacción...");
      await transaction.rollback();
    }
  } finally {
    if (pool) {
      pool.close();
      console.log("Pool de conexión cerrado.");
    }
  }
}

/**
 * FASE 1: Lee todos los IDs de las tablas maestras
 */
async function loadMasterData(transaction) {
  try {
    const request = transaction.request();

    const categoriasRes = await request.query("SELECT id FROM Categorias");
    const medicosRes = await request.query(
      "SELECT ID_Medico, ID_Especialidad FROM Medicos"
    );
    const obrasSocialesRes = await request.query(
      "SELECT ID_ObraSocial FROM ObrasSociales"
    );
    const planesRes = await request.query(
      "SELECT ID_Plan, ID_ObraSocial FROM Planes"
    );
    const serviciosRes = await request.query(
      "SELECT ID_Servicio, ID_Especialidad, CostoBase FROM Servicios"
    );
    const estadosTurnoRes = await request.query(
      "SELECT ID_EstadoTurno, Descripcion FROM EstadosTurnoMedico"
    );
    const estadosFacturaRes = await request.query(
      "SELECT ID_EstadoFactura, Descripcion FROM EstadosFacturaPaciente"
    );
    const pacientesRes = await request.query(
      "SELECT ID_Paciente FROM Pacientes"
    );

    const data = {
      categorias: categoriasRes.recordset.map((r) => r.id),
      medicos: medicosRes.recordset,
      obrasSociales: obrasSocialesRes.recordset.map((r) => r.ID_ObraSocial),
      planes: planesRes.recordset,
      servicios: serviciosRes.recordset,
      estadosTurno: estadosTurnoRes.recordset,
      estadosFactura: estadosFacturaRes.recordset,
      pacientes: pacientesRes.recordset.map((r) => r.ID_Paciente),
    };

    if (!data.categorias.length)
      console.warn("Advertencia: No se encontraron Categorías.");
    if (!data.medicos.length)
      throw new Error(
        "Error: No se encontraron Médicos. El seeder no puede continuar."
      );
    if (!data.servicios.length)
      throw new Error(
        "Error: No se encontraron Servicios. El seeder no puede continuar."
      );
    console.log(
      `Cargados: ${data.pacientes.length} pacientes, ${data.medicos.length} médicos, ${data.categorias.length} categorías, ${data.obrasSociales.length} OS, ${data.planes.length} planes, ${data.servicios.length} servicios.`
    );
    return data;
  } catch (error) {
    console.error("Error cargando datos maestros:", error.message);
    return null;
  }
}

/**
 * FASE 2: Crea nuevos proveedores localizados en CABA.
 */
async function createProveedores(transaction, cantidad) {
  console.log(`Creando ${cantidad} proveedores...`);
  for (let i = 0; i < cantidad; i++) {
    const request = transaction.request();
    request.input("nombre", sql.NVarChar, `${faker.company.name()} S.R.L.`);
    request.input(
      "direccion",
      sql.NVarChar,
      faker.location.streetAddress(false)
    );
    request.input(
      "barrio",
      sql.NVarChar,
      faker.helpers.arrayElement(BARRIOS_CABA)
    );
    request.input("telefono", sql.NVarChar, faker.phone.number());
    await request.query(`INSERT INTO proveedores (nombre, direccion, barrio, telefono)
       VALUES (@nombre, @direccion, @barrio, @telefono)`);
  }
  console.log(`👍 ${cantidad} proveedores creados.`);
}

/**
 * FASE 2: Crea nuevos productos médicos y los asigna a categorías existentes.
 */
async function createProductos(transaction, cantidad, masterData) {
  console.log(`Creando ${cantidad} productos...`);
  if (masterData.categorias.length === 0) {
    console.warn("No hay categorías para asignar productos. Saltando...");
    return;
  }

  for (let i = 0; i < cantidad; i++) {
    const request = transaction.request();
    const nombreProducto =
      i < NOMBRES_PRODUCTOS_MEDICOS.length
        ? NOMBRES_PRODUCTOS_MEDICOS[i]
        : `${faker.commerce.productName()} (Genérico)`;
    request.input("nombre", sql.NVarChar, nombreProducto);

    request.input(
      "descripcion",
      sql.NVarChar,
      `Set de ${nombreProducto} de uso profesional para procedimientos clínicos.`
    );

    request.input(
      "codigo",
      sql.NVarChar,
      `P-${faker.string.alphanumeric(8).toUpperCase()}`
    );
    request.input("unidadMedida", sql.NVarChar, "Unidad");
    request.input("stock", sql.Int, faker.number.int({ min: 5, max: 200 }));
    request.input(
      "stockMinimo",
      sql.Int,
      faker.number.int({ min: 10, max: 50 })
    );
    request.input("activo", sql.Bit, 1);
    request.input(
      "categoriaId",
      sql.Int,
      faker.helpers.arrayElement(masterData.categorias)
    );
    await request.query(`INSERT INTO productos (nombre, descripcion, codigo, unidadMedida, stock, stockMinimo, activo, categoriaId)
       VALUES (@nombre, @descripcion, @codigo, @unidadMedida, @stock, @stockMinimo, @activo, @categoriaId)`);
  }
  console.log(`👍 ${cantidad} productos creados.`);
}

/**
 * FASE 2: Crea nuevos pacientes realistas, localizados y con cobertura médica aleatoria.
 */
async function createPacientes(transaction, cantidad, masterData) {
  console.log(`Creando ${cantidad} pacientes...`);
  const nuevosPacienteIDs = [];

  for (let i = 0; i < cantidad; i++) {
    const request = transaction.request();
    const nombre = faker.person.firstName();
    const apellido = faker.person.lastName();
    let idObraSocial = null;
    let idPlan = null;
    let numeroAfiliado = null;

    if (faker.number.int({ min: 1, max: 10 }) <= 7) {
      idObraSocial = faker.helpers.arrayElement(masterData.obrasSociales);
      const planesDisponibles = masterData.planes.filter(
        (p) => p.ID_ObraSocial === idObraSocial
      );
      if (planesDisponibles.length > 0) {
        idPlan = faker.helpers.arrayElement(planesDisponibles).ID_Plan;
        numeroAfiliado = faker.string.numeric(10);
      } else {
        idObraSocial = null;
      }
    }

    request.input("Nombre", sql.VarChar, nombre);
    request.input("Apellido", sql.VarChar, apellido);
    request.input(
      "DNI",
      sql.VarChar,
      faker.number.int({ min: 20000000, max: 45000000 }).toString()
    );
    request.input("Telefono", sql.VarChar, faker.phone.number());
    request.input(
      "Email",
      sql.VarChar,
      faker.internet.email({ firstName: nombre, lastName: apellido })
    );
    request.input(
      "FechaNacimiento",
      sql.Date,
      faker.date.birthdate({ min: 1940, max: 2005, mode: "year" })
    );
    request.input(
      "Genero",
      sql.VarChar,
      faker.helpers.arrayElement(["Masculino", "Femenino", "Otro"])
    );
    request.input(
      "Direccion",
      sql.VarChar,
      faker.location.streetAddress(false)
    );
    request.input("Ciudad", sql.VarChar, CIUDAD);
    request.input("Provincia", sql.VarChar, PROVINCIA);
    request.input("Activo", sql.Bit, 1);
    request.input("ID_ObraSocial", sql.Int, idObraSocial);
    request.input("ID_Plan", sql.Int, idPlan);
    request.input("NumeroAfiliado", sql.VarChar, numeroAfiliado);

    const result = await request.query(`INSERT INTO Pacientes (
        Nombre, Apellido, DNI, Telefono, Email, FechaNacimiento, Genero,
        Direccion, Ciudad, Provincia, Activo, ID_ObraSocial, ID_Plan, NumeroAfiliado
       )
       OUTPUT inserted.ID_Paciente
       VALUES (
        @Nombre, @Apellido, @DNI, @Telefono, @Email, @FechaNacimiento, @Genero,
        @Direccion, @Ciudad, @Provincia, @Activo, @ID_ObraSocial, @ID_Plan, @NumeroAfiliado
       )`);
    nuevosPacienteIDs.push(result.recordset[0].ID_Paciente);
  }
  console.log(`👍 ${cantidad} pacientes creados.`);
  return nuevosPacienteIDs;
}

/**
 * FASE 3: Crea turnos históricos, vinculando pacientes y médicos.
 */
async function createTurnos(transaction, cantidad, pacienteIds, masterData) {
  console.log(`Creando ${cantidad} turnos históricos...`);
  const { medicos, estadosTurno } = masterData;

  const idCompletado = estadosTurno.find(
    (e) => e.Descripcion === "Completado"
  )?.ID_EstadoTurno;
  const idAusente = estadosTurno.find(
    (e) => e.Descripcion === "Ausente"
  )?.ID_EstadoTurno;
  const idCancelado = estadosTurno.find(
    (e) => e.Descripcion === "Cancelado"
  )?.ID_EstadoTurno;

  if (!idCompletado || !idAusente || !idCancelado) {
    throw new Error(
      'No se encontraron los estados de turno ("Completado", "Ausente", "Cancelado"). Verifica tu tabla EstadosTurnoMedico.'
    );
  }
  const pesosEstados = [
    { weight: 70, value: idCompletado },
    { weight: 20, value: idAusente },
    { weight: 10, value: idCancelado },
  ];

  for (let i = 0; i < cantidad; i++) {
    const request = transaction.request();
    const pacienteId = faker.helpers.arrayElement(pacienteIds);
    const medicoId = faker.helpers.arrayElement(medicos).ID_Medico;
    const estadoId = faker.helpers.weightedArrayElement(pesosEstados);
    const fechaHora = faker.date.between({
      from: FECHA_HACE_UN_ANO,
      to: FECHA_HOY,
    });

    request.input("FechaHora", sql.DateTime, fechaHora);
    request.input(
      "Consultorio",
      sql.VarChar,
      `Consultorio ${faker.number.int({ min: 1, max: 8 })}`
    );
    request.input("ID_Paciente", sql.Int, pacienteId);
    request.input("ID_Medico", sql.Int, medicoId);
    request.input("ID_EstadoTurno", sql.Int, estadoId);
    await request.query(`INSERT INTO TurnosMedicos (FechaHora, Consultorio, ID_Paciente, ID_Medico, ID_EstadoTurno, RecordatorioEnviado)
       VALUES (@FechaHora, @Consultorio, @ID_Paciente, @ID_Medico, @ID_EstadoTurno, 1)`);
  }
  console.log(`👍 ${cantidad} turnos creados.`);
}

/**
 * FASE 3: Crea facturas y detalles para los turnos "Completados".
 */
async function createFacturasYDetalles(transaction, masterData) {
  console.log("Creando facturas para turnos completados...");
  const { servicios, medicos, estadosFactura, estadosTurno } = masterData;

  const idCompletado = estadosTurno.find(
    (e) => e.Descripcion === "Completado"
  )?.ID_EstadoTurno;
  const idPagada = estadosFactura.find(
    (e) => e.Descripcion === "Pagada"
  )?.ID_EstadoFactura;
  const idPendiente = estadosFactura.find(
    (e) => e.Descripcion === "Pendiente de Pago"
  )?.ID_EstadoFactura;

  if (!idPagada || !idPendiente) {
    throw new Error(
      "No se encontraron estados 'Pagada' o 'Pendiente de Pago' en EstadosFacturaPaciente."
    );
  }
  const request = transaction.request();
  const turnosCompletados = (
    await request.query(`SELECT ID_TurnoMedico, FechaHora, ID_Paciente, ID_Medico
     FROM TurnosMedicos
     WHERE ID_EstadoTurno = ${idCompletado}`)
  ).recordset;

  let facturasCreadas = 0;
  for (const turno of turnosCompletados) {
    if (faker.number.int({ min: 1, max: 10 }) > 8) {
      continue;
    }

    const medico = medicos.find((m) => m.ID_Medico === turno.ID_Medico);
    const serviciosDisponibles = servicios.filter(
      (s) => s.ID_Especialidad === medico?.ID_Especialidad
    );
    const servicio =
      serviciosDisponibles.length > 0
        ? faker.helpers.arrayElement(serviciosDisponibles)
        : faker.helpers.arrayElement(servicios);

    const totalFactura = parseFloat(servicio.CostoBase) * 1.21;
    const estadoFactura = faker.helpers.weightedArrayElement([
      { weight: 90, value: idPagada },
      { weight: 10, value: idPendiente },
    ]);

    const factRequest = transaction.request();
    factRequest.input("FechaEmision", sql.DateTime, turno.FechaHora);
    factRequest.input("Total", sql.Decimal(12, 2), totalFactura);
    factRequest.input("ID_Paciente", sql.Int, turno.ID_Paciente);
    factRequest.input("ID_EstadoFactura", sql.Int, estadoFactura);
    factRequest.input(
      "NumeroFactura",
      sql.VarChar,
      `F-001-${faker.string.numeric(8)}`
    );

    const factResult =
      await factRequest.query(`INSERT INTO FacturasPacientes (FechaEmision, Total, ID_Paciente, ID_EstadoFactura, NumeroFactura)
       OUTPUT inserted.ID_FacturaPaciente
       VALUES (@FechaEmision, @Total, @ID_Paciente, @ID_EstadoFactura, @NumeroFactura)`);
    const nuevaFacturaId = factResult.recordset[0].ID_FacturaPaciente;

    const detRequest = transaction.request();
    detRequest.input("ID_FacturaPaciente", sql.Int, nuevaFacturaId);
    detRequest.input("ID_Servicio", sql.Int, servicio.ID_Servicio);
    detRequest.input("PrecioUnitario", sql.Decimal(10, 2), servicio.CostoBase);
    detRequest.input("SubTotal", sql.Decimal(12, 2), servicio.CostoBase);

    await detRequest.query(`INSERT INTO DetallesFacturaPaciente (ID_FacturaPaciente, ID_Servicio, Cantidad, PrecioUnitario, SubTotal)
       VALUES (@ID_FacturaPaciente, @ID_Servicio, 1, @PrecioUnitario, @SubTotal)`);
    facturasCreadas++;
  }
  console.log(`👍 ${facturasCreadas} facturas (y sus detalles) creadas.`);
}

runSeeder();
