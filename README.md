# MDM System — Gestión de Clínica Médica

Sistema web para administrar una clínica médica: turnos, pacientes, facturación, stock de insumos, compras a proveedores y reportes, con acceso por roles.

El repositorio tiene dos aplicaciones separadas:

- **`backend/`**: API REST en Node.js + Express 5 que se conecta a Microsoft SQL Server.
- **`frontend/`**: aplicación web en React 19 + Vite 6 + Material UI.

---

## Estructura del proyecto

```text
gestion-clinica/
├── backend/
│   ├── server.js              # Punto de entrada: monta las rutas y arranca en el puerto 3000
│   ├── createUser.js          # Script para crear un usuario (con contraseña encriptada)
│   ├── seeder.js              # Script opcional que carga datos de prueba de un año
│   ├── db_scripts/            # Scripts SQL de la base, se corren en orden (001 → 009)
│   └── src/
│       ├── config/            # env.js (lee .env), validateEnv.js, database.js (conexión a SQL Server)
│       ├── controllers/       # authController.js
│       ├── factories/         # dbFactory.js (fábrica de conexiones a la base)
│       ├── routes/            # Un archivo por módulo: turnos, pacientes, facturacion, compras...
│       ├── services/          # authService (login + JWT), emailService, reminderService (recordatorios)
│       └── utils/             # dateUtils.js
└── frontend/
    ├── index.html
    ├── public/                # Logos e imágenes
    └── src/
        ├── main.jsx           # Arranque: router, tema MUI y contexto de sesión
        ├── App.jsx            # Rutas de la app y permisos por rol
        ├── Components/
        │   ├── common/        # Piezas reutilizables (dashboard, rutas protegidas, tarjetas)
        │   ├── layouts/       # Layout de formularios
        │   └── pages/         # Pantallas por módulo: turnos, pacientes, facturas, compras,
        │                      # productos, categorías, proveedores, reportes, usuarios, login (form)
        ├── context/           # Estado de la sesión del usuario (authContext)
        ├── theme/             # Paleta y tema de Material UI
        ├── styles/            # Estilos de botones
        └── utils/             # roles.js, icons.jsx
```

### Rutas de la API

Todas cuelgan de `http://localhost:3000`:

| Ruta | Módulo |
|---|---|
| `/api/auth` | Login |
| `/api/turnos` | Turnos |
| `/api/pacientes` | Pacientes |
| `/api/profesionales`, `/api/especialidades` | Médicos y especialidades |
| `/api/facturacion`, `/api/servicios`, `/api/metodos-pago`, `/api/obras-sociales` | Facturación |
| `/api/productos`, `/api/categorias` | Inventario |
| `/proveedores` (sin `/api`), `/api/compras`, `/api/gastos` | Compras |
| `/api/dashboard`, `/api/reportes` | Métricas y reportes |
| `/api/usuarios` | Usuarios |

### Roles

Definidos en `frontend/src/utils/roles.js`. El valor del campo `Rol` en la tabla `Usuarios` tiene que coincidir exactamente con uno de estos:

| Rol (valor exacto) | Acceso |
|---|---|
| `Administrador` | Todo el sistema |
| `Recepcionista` | Turnos, pacientes y facturación |
| `Deposito` (sin tilde) | Productos, categorías e inventario |

---

## Instalación paso a paso

### 1. Requisitos

Instalá esto antes de empezar:

- **Node.js 18 o superior** (incluye `npm`). Para comprobarlo: `node -v`.
- **Git**.
- **Microsoft SQL Server** (sirve la edición gratuita Express o Developer) y una herramienta para ejecutar scripts: **SQL Server Management Studio (SSMS)**, Azure Data Studio o `sqlcmd`.

### 2. Preparar SQL Server

La aplicación se conecta con **usuario y contraseña de SQL Server**, no con la autenticación de Windows. Por eso:

1. Activá la autenticación mixta: en SSMS, clic derecho sobre el servidor → *Propiedades* → *Seguridad* → **SQL Server and Windows Authentication mode**. Después reiniciá el servicio de SQL Server.
2. Creá un login, o usá `sa` con una contraseña, que tenga permisos para crear bases de datos.
3. Verificá que el protocolo **TCP/IP** esté habilitado en *SQL Server Configuration Manager* → *Protocolos de red*.

### 3. Clonar el repositorio

```bash
git clone https://github.com/matiasch256/gestion-clinica.git
cd gestion-clinica
```

### 4. Crear la base de datos

Ejecutá los scripts de `backend/db_scripts/` **en orden, del 001 al 009**:

1. **`001_initial_schema.sql`**: crea la base `MDMSYSTEM` con sus tablas y datos iniciales. ⚠️ **Si ya existe una base `MDMSYSTEM`, la borra.**
2. **`002` a `007`**: estos scripts **no incluyen `USE [MDMSYSTEM]`**. Antes de ejecutarlos, seleccioná la base `MDMSYSTEM` (en SSMS, con el desplegable de bases de datos). Si no, fallan o se aplican sobre la base `master`.
3. **`008` y `009`**: ya seleccionan la base por su cuenta.

Con `sqlcmd`, desde la carpeta `backend/db_scripts`:

```bash
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -i 001_initial_schema.sql
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -d MDMSYSTEM -i 002_add_email_to_pacientes.sql
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -d MDMSYSTEM -i 003_update_pacientes_with_test_emails.sql
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -d MDMSYSTEM -i 004_add_reminder_fields_to_turnos.sql
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -d MDMSYSTEM -i 005_add_dni_to_pacientes.sql
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -d MDMSYSTEM -i 006_add_activo_to_pacientes.sql
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -d MDMSYSTEM -i 007_expand_pacientes_table.sql
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -d MDMSYSTEM -i 008_add_campos_facturacion.sql
sqlcmd -S localhost -U sa -P "TU_PASSWORD" -d MDMSYSTEM -i 009_create_obras_sociales_planes.sql
```

### 5. Configurar el backend

```bash
cd backend
npm install
```

Creá el archivo `backend/.env`. Git lo ignora, así que no se sube al repositorio:

```env
# Base de datos (obligatorias: sin ellas el servidor no arranca)
DB_USER=sa
DB_PASSWORD=TU_PASSWORD
DB_SERVER=localhost
DB_DATABASE=MDMSYSTEM

# Clave para firmar los tokens de sesión (obligatoria para poder iniciar sesión)
JWT_SECRET=una_clave_larga_y_secreta

# Email para recordatorios de turnos (opcional; sin esto los recordatorios fallan pero la app funciona)
MAILGUN_SMTP_HOST=smtp.mailgun.org
MAILGUN_SMTP_PORT=587
MAILGUN_SMTP_USER=
MAILGUN_SMTP_PASS=
MAILGUN_DOMAIN=

# Usuario a crear con createUser.js (paso 6)
NEW_USER_NAME=Admin
NEW_USER_EMAIL=admin@clinica.com
NEW_USER_PASSWORD=admin123
NEW_USER_ROL=Administrador
```

> Si SQL Server corre como instancia con nombre (por ejemplo, SQL Express), probá con `DB_SERVER=localhost\SQLEXPRESS`.

### 6. Crear un usuario para entrar

La base trae dos usuarios de ejemplo, pero sus contraseñas no están documentadas. Lo más simple es crear uno propio con los datos `NEW_USER_*` del `.env`:

```bash
# dentro de backend/
node createUser.js
```

Definí siempre `NEW_USER_ROL` con uno de los roles de la tabla de arriba. Si no lo ponés, el script usa `Usuario`, que no es un rol válido, y ese usuario no va a poder entrar a ninguna pantalla.

### 7. Levantar el backend

```bash
# dentro de backend/
npm run dev      # modo desarrollo: se reinicia solo al guardar cambios (nodemon)
# o
npm start        # modo normal
```

Si todo está bien, vas a ver `Servidor corriendo en http://localhost:3000`. Cada minuto también aparece en consola `⏰ Ejecutando tarea de recordatorio de turnos...`: es el servicio de recordatorios por email, y es normal.

### 8. Levantar el frontend

En **otra terminal**, sin cerrar la del backend:

```bash
cd frontend
npm install
npm run dev
```

Abrí `http://localhost:5173` en el navegador e iniciá sesión con el usuario del paso 6.

---

## Datos de prueba (opcional)

`backend/seeder.js` agrega 10 proveedores, 50 productos, 150 pacientes, 1000 turnos del último año y sus facturas. Usa una librería que **no está en `package.json`**, así que primero hay que instalarla:

```bash
# dentro de backend/
npm install @faker-js/faker
node seeder.js
```

Conviene correrlo con el backend detenido. Si algo falla, deshace todos los cambios (usa una transacción).

---

## Comandos útiles

| Dónde | Comando | Qué hace |
|---|---|---|
| `backend/` | `npm run dev` | API en modo desarrollo (puerto 3000) |
| `backend/` | `npm start` | API en modo normal |
| `backend/` | `node createUser.js` | Crea un usuario con los datos `NEW_USER_*` del `.env` |
| `backend/` | `node seeder.js` | Carga datos de prueba |
| `frontend/` | `npm run dev` | App web en modo desarrollo (puerto 5173) |
| `frontend/` | `npm run build` | Genera la versión de producción en `frontend/dist` |
| `frontend/` | `npm run lint` | Revisa el código con ESLint |

---

## Problemas comunes

- **`La variable de entorno DB_... no está definida`**: falta el archivo `backend/.env` o alguna de las variables `DB_*`. Ejecutá el backend desde la carpeta `backend/`, porque el `.env` se busca en la carpeta actual.
- **`Error al conectar a la base de datos`**: revisá el paso 2 (autenticación mixta, TCP/IP habilitado, servicio iniciado) y el valor de `DB_SERVER`.
- **El login no funciona**: verificá que `JWT_SECRET` esté definido y que el usuario tenga un rol válido.
- **El frontend no trae datos**: la dirección del backend (`http://localhost:3000`) está fija en el código del frontend, así que el backend tiene que estar corriendo en ese puerto.
