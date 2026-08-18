# MDM System — Gestión de Clínica Médica

Sistema web full-stack desarrollado para la gestión integral de una clínica médica. Este proyecto fue concebido y desarrollado para resolver flujos operativos reales del sector salud, abarcando desde la atención al paciente hasta la administración y control del negocio.

Permite administrar turnos, pacientes, facturación, stock de insumos, compras a proveedores y métricas analíticas, garantizando la seguridad y control de acceso mediante permisos por roles.

---

## 🚀 Características Principales

- **Gestión de Turnos y Pacientes**: 
  - ABM completo de pacientes con registro de obra social, planes y DNI.
  - Gestión integral del ciclo de turnos (alta, reprogramación, cancelación y cambios de estado).
  - Recordatorios automáticos de turnos enviados por email mediante tareas programadas.
- **Módulo de Facturación y Pagos**: 
  - Emisión de facturas detalladas por servicios médicos.
  - Registro de múltiples métodos de pago y seguimiento de estados de cobro.
- **Inventario y Proveedores**: 
  - Control de productos e insumos médicos con alertas por stock crítico.
  - Registro y seguimiento de compras y ABM de proveedores.
- **Dashboards y Reportes Operativos**: 
  - Paneles visuales de gastos, compras y actividad reciente.
  - Exportación de reportes a formatos Excel y PDF (ausentismo, rentabilidad, stock por categoría).
- **Seguridad y Control de Acceso**: 
  - Autenticación mediante tokens JWT y contraseñas encriptadas con bcrypt.
  - Rutas protegidas en el cliente según el rol del usuario (Administrador, Recepcionista, Depósito).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, React Router 7, Material UI (MUI 7), MUI X Charts, Recharts, Axios, Day.js, jsPDF, SheetJS (xlsx) |
| **Backend** | Node.js, Express 5 (ESM), Microsoft SQL Server (`mssql` / `tedious`), JWT, bcrypt, node-cron, Nodemailer |
| **Base de Datos** | Microsoft SQL Server |
| **Control de Calidad** | ESLint 9, nodemon |

---

## 🏗️ Arquitectura del Proyecto

El sistema está estructurado como un monorepo compuesto por dos aplicaciones independientes:

```text
gestion-clinica/
├── backend/                  # API REST con Express y Node.js
│   ├── db_scripts/           # Scripts de esquema y migraciones SQL
│   ├── src/
│   │   ├── config/           # Configuración de variables y conexión a BD
│   │   ├── controllers/      # Controladores de la aplicación
│   │   ├── factories/        # Abstracción y factory de base de datos
│   │   ├── routes/           # Endpoints organizados por dominio
│   │   ├── services/         # Lógica de negocio (auth, email, recordatorios)
│   │   └── utils/            # Utilidades generales
│   └── server.js             # Entrada principal del servidor
└── frontend/                 # Single Page Application (SPA) con React
    └── src/
        ├── Components/       # Componentes reutilizables, layouts y vistas
        ├── context/          # Manejo del estado global de autenticación
        └── theme/            # Configuración visual con Material UI
```

---

## ⚙️ Puesta en Marcha

### Requisitos Previos
- **Node.js** (versión 18 o superior)
- **Microsoft SQL Server** (local o remoto)

### 1. Clonar el repositorio
```bash
git clone [https://github.com/matiasch256/gestion-clinica.git](https://github.com/matiasch256/gestion-clinica.git)
cd gestion-clinica
```

### 2. Base de Datos
Ejecuta de manera secuencial los scripts ubicados en `backend/db_scripts/` (del `001` al `009`) en tu servidor de SQL Server para crear la base de datos `MDMSYSTEM`, las tablas correspondientes y los datos iniciales.

### 3. Configuración del Backend
En una terminal:
```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend` con la siguiente estructura:
```env
DB_USER=tu_usuario_sql
DB_PASSWORD=tu_password_sql
DB_SERVER=localhost
DB_DATABASE=MDMSYSTEM
JWT_SECRET=tu_clave_secreta_jwt
```

Inicia el servidor en modo desarrollo:
```bash
npm run dev
```
> La API quedará corriendo en `http://localhost:3000`.

### 4. Configuración del Frontend
En una segunda terminal:
```bash
cd frontend
npm install
npm run dev
```
> La aplicación web se iniciará en `http://localhost:5173`.

---

## 👥 Roles y Permisos

- **Administrador**: Control total sobre el sistema, incluyendo compras, proveedores, métricas de rentabilidad y administración de usuarios.
- **Recepcionista**: Acceso a la gestión de turnos médicos, padrón de pacientes y emisión de facturas.
- **Depósito**: Administración exclusiva del catálogo de productos, categorías y alertas de inventario.


---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
