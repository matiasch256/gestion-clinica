# MDM System — Gestión de Clínica Médica

Sistema web para administrar una clínica médica: turnos, pacientes, facturación, stock de insumos, compras a proveedores y reportes, con acceso por roles.

El repositorio tiene dos aplicaciones separadas:

- **`backend/`**: API REST en Node.js + Express 5 que se conecta a Microsoft SQL Server.
- **`frontend/`**: aplicación web en React 19 + Vite 6 + Material UI.

---

## Estructura del proyecto

```text
gestion-clinica/
├── .gitignore                 # Excluye node_modules, .env y compilados
├── backend/
│   ├── server.js              # Punto de entrada: monta las rutas y arranca en el puerto 3000
│   ├── createUser.js          # Script para crear usuarios de la app (contraseña encriptada)
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
        │   ├── common/        # Piezas reutilizables (layout con menú, dashboard, rutas protegidas)
        │   ├── layouts/       # Layout de formularios
        │   └── pages/         # Pantallas por módulo: turnos, pacientes, facturas, compras,
        │                      # productos, categorías, proveedores, reportes, usuarios, login (form)
        ├── context/           # Estado de la sesión del usuario (authContext)
        ├── theme/             # Paleta y tema de Material UI
        ├── styles/            # Estilos de botones
        └── utils/             # roles.js, icons.jsx
```

Los estilos del frontend se escriben **solo con Material UI** (prop `sx` y `theme.palette`). No se usan `className` ni archivos `.css`.

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
| `/api/usuarios` | Usuarios (ver la nota del paso 7) |

### Roles

Definidos en `frontend/src/utils/roles.js`. El valor del campo `Rol` en la tabla `Usuarios` tiene que coincidir **exactamente** con uno de estos (mayúsculas y tildes incluidas):

| Rol (valor exacto) | Acceso |
|---|---|
| `Administrador` | Todo el sistema |
| `Recepcionista` | Turnos, pacientes y facturación |
| `Deposito` (sin tilde) | Productos, categorías e inventario |

---

## Instalación paso a paso

Hay dos tipos de usuario y conviene no confundirlos:

- **Usuario de SQL Server** (por ejemplo `clinica_user`): lo usa el backend para conectarse a la base. Va en el `.env` como `DB_USER` / `DB_PASSWORD`.
- **Usuario de la aplicación** (por ejemplo `admin@clinica.com`): es la persona que inicia sesión en la web. Se guarda en la tabla `Usuarios` y se crea con `createUser.js`.

### 1. Requisitos

Instalá esto antes de empezar:

- **Node.js 18 o superior** (incluye `npm`). Para comprobarlo: `node -v`.
- **Git**.
- **Microsoft SQL Server**. Sirve la edición gratuita Express o Developer.
- Una herramienta para ejecutar scripts SQL: **SQL Server Management Studio (SSMS)**, Azure Data Studio o `sqlcmd`.

### 2. Preparar SQL Server

La aplicación se conecta con **usuario y contraseña de SQL Server**, no con la autenticación de Windows. Por eso:

1. **Activá la autenticación mixta.** En SSMS, clic derecho sobre el servidor → *Propiedades* → *Seguridad* → **SQL Server and Windows Authentication mode**.
2. **Habilitá TCP/IP.** En *SQL Server Configuration Manager* → *Configuración de red de SQL Server* → *Protocolos* → **TCP/IP: Habilitado**.
3. **Reiniciá el servicio** *SQL Server (MSSQLSERVER)*, o el de tu instancia, para que se apliquen los cambios.

### 3. Clonar el repositorio

```bash
git clone https://github.com/matiasch256/gestion-clinica.git
cd gestion-clinica
```

### 4. Crear la base de datos

Ejecutá los scripts con un usuario administrador de SQL Server. Puede ser tu usuario de Windows en SSMS o `sa`. Tienen que correrse **en orden, del 001 al 009**:

1. **`001_initial_schema.sql`**: crea la base `MDMSYSTEM` con sus tablas y datos iniciales. ⚠️ **Si ya existe una base `MDMSYSTEM`, la borra con todos sus datos.** No lo vuelvas a correr si ya tenés la base armada.
2. **`002` a `007`**: estos scripts **no incluyen `USE [MDMSYSTEM]`**. Antes de ejecutarlos, seleccioná la base `MDMSYSTEM` (en SSMS, con el desplegable de bases de datos de la barra superior). Si no, fallan o se aplican sobre la base `master`.
3. **`008` y `009`**: ya seleccionan la base por su cuenta.

Con `sqlcmd`, desde la carpeta `backend/db_scripts` (`-E` usa tu usuario de Windows y `-C` acepta el certificado local):

```bash
sqlcmd -S localhost -E -C -i 001_initial_schema.sql
sqlcmd -S localhost -E -C -d MDMSYSTEM -i 002_add_email_to_pacientes.sql
sqlcmd -S localhost -E -C -d MDMSYSTEM -i 003_update_pacientes_with_test_emails.sql
sqlcmd -S localhost -E -C -d MDMSYSTEM -i 004_add_reminder_fields_to_turnos.sql
sqlcmd -S localhost -E -C -d MDMSYSTEM -i 005_add_dni_to_pacientes.sql
sqlcmd -S localhost -E -C -d MDMSYSTEM -i 006_add_activo_to_pacientes.sql
sqlcmd -S localhost -E -C -d MDMSYSTEM -i 007_expand_pacientes_table.sql
sqlcmd -S localhost -E -C -d MDMSYSTEM -i 008_add_campos_facturacion.sql
sqlcmd -S localhost -E -C -d MDMSYSTEM -i 009_create_obras_sociales_planes.sql
```

### 5. Crear el usuario de SQL Server para el backend

Conviene que el backend no use `sa`, sino un usuario propio con permisos solo sobre `MDMSYSTEM`. Ejecutá esto en SSMS (o con `sqlcmd -S localhost -E -C -Q "..."`) y cambiá la contraseña por una tuya:

```sql
CREATE LOGIN clinica_user WITH PASSWORD = 'UnaPasswordSegura123!', CHECK_POLICY = OFF;
GO
USE MDMSYSTEM;
GO
CREATE USER clinica_user FOR LOGIN clinica_user;
ALTER ROLE db_owner ADD MEMBER clinica_user;
GO
```

Para comprobar que el usuario puede conectarse:

```bash
sqlcmd -S localhost -U clinica_user -P "UnaPasswordSegura123!" -C -d MDMSYSTEM -Q "SELECT COUNT(*) FROM Usuarios"
```

### 6. Configurar el backend (`.env`)

Instalá las dependencias:

```bash
cd backend
npm install
```

Creá un archivo llamado exactamente **`.env`** dentro de la carpeta `backend/`, al lado de `server.js`, con este contenido:

```env
# --- Conexión a la base (obligatorias: sin ellas el servidor no arranca) ---
DB_USER=clinica_user
DB_PASSWORD=UnaPasswordSegura123!
DB_SERVER=localhost
DB_DATABASE=MDMSYSTEM

# --- Clave para firmar los tokens de sesión (obligatoria para poder iniciar sesión) ---
# Cualquier texto largo y difícil de adivinar.
JWT_SECRET=cambia_esto_por_un_texto_largo_y_secreto

# --- Email para recordatorios de turnos (opcional) ---
# Sin estos datos la app funciona igual; solo fallan los recordatorios por email.
MAILGUN_SMTP_HOST=smtp.mailgun.org
MAILGUN_SMTP_PORT=587
MAILGUN_SMTP_USER=
MAILGUN_SMTP_PASS=
MAILGUN_DOMAIN=
```

> - Si SQL Server corre como instancia con nombre (por ejemplo, SQL Express), usá `DB_SERVER=localhost\SQLEXPRESS`.
> - **El `.env` nunca se sube a GitHub**, porque está en el `.gitignore`. Cada persona que instale el proyecto tiene que crear el suyo.

### 7. Crear los usuarios de la aplicación

La base trae dos usuarios de ejemplo (`matias32@gmail.com` y `laura_barrancas@gmail.com`), pero sus contraseñas no están documentadas. Para entrar, creá tus propios usuarios con el script `backend/createUser.js`.

El script lee estos cuatro datos y guarda la contraseña encriptada (bcrypt) en la tabla `Usuarios`:

| Variable | Qué es | Ejemplo |
|---|---|---|
| `NEW_USER_NAME` | Nombre que se muestra en la app | `Admin` |
| `NEW_USER_EMAIL` | Email para iniciar sesión (no se puede repetir) | `admin@clinica.com` |
| `NEW_USER_PASSWORD` | Contraseña para iniciar sesión | `admin123` |
| `NEW_USER_ROL` | Rol: `Administrador`, `Recepcionista` o `Deposito` | `Administrador` |

> ⚠️ Definí siempre `NEW_USER_ROL`. Si no lo ponés, el script usa `Usuario`, que no es un rol válido, y ese usuario no va a poder entrar a ninguna pantalla.

**Opción A: agregar los datos al `.env`.** Agregá estas líneas al final de `backend/.env`:

```env
NEW_USER_NAME=Admin
NEW_USER_EMAIL=admin@clinica.com
NEW_USER_PASSWORD=admin123
NEW_USER_ROL=Administrador
```

y ejecutá, dentro de `backend/`:

```bash
node createUser.js
```

Para crear otro usuario, cambiá los valores en el `.env` y volvé a ejecutar el script. Cuando termines, podés borrar esas líneas del `.env`.

**Opción B: pasar los datos en el comando, sin tocar el `.env`.**

En **PowerShell**, dentro de `backend/`:

```powershell
$env:NEW_USER_NAME="Recepción"; $env:NEW_USER_EMAIL="recepcion@clinica.com"; $env:NEW_USER_PASSWORD="recep123"; $env:NEW_USER_ROL="Recepcionista"; node createUser.js
```

En **Git Bash**, dentro de `backend/`:

```bash
NEW_USER_NAME="Depósito" NEW_USER_EMAIL="deposito@clinica.com" NEW_USER_PASSWORD="depo123" NEW_USER_ROL="Deposito" node createUser.js
```

Qué puede responder el script:
- `✅ ¡Usuario '...' creado exitosamente!`: listo, ya podés entrar con ese email y contraseña.
- `⚠️ El email '...' ya existe`: ya hay un usuario con ese email; usá otro.
- `❌ Por favor, asegúrate de que las variables ...`: falta alguno de los datos.

Para ver los usuarios que existen:

```sql
SELECT UsuarioID, Nombre, Email, Rol, Activo FROM MDMSYSTEM.dbo.Usuarios;
```

Para cambiarle el rol a un usuario, o desactivarlo para que no pueda entrar:

```sql
UPDATE MDMSYSTEM.dbo.Usuarios SET Rol = 'Recepcionista' WHERE Email = 'admin@clinica.com';
UPDATE MDMSYSTEM.dbo.Usuarios SET Activo = 0 WHERE Email = 'admin@clinica.com';
```

Si te olvidás una contraseña, no hay forma de recuperarla: lo más simple es borrar ese usuario y crearlo de nuevo con el script:

```sql
DELETE FROM MDMSYSTEM.dbo.Usuarios WHERE Email = 'admin@clinica.com';
```

> **Nota:** la pantalla `/usuarios` de la aplicación **todavía no crea usuarios reales**. El endpoint `POST /api/usuarios` guarda en una tabla de prueba (`PruebaUsuarios`) que no existe en la base. Hasta que se corrija, usá `createUser.js`.

### 8. Levantar el backend

Dentro de `backend/`:

```bash
npm run dev      # modo desarrollo: se reinicia solo al guardar cambios (nodemon)
# o
npm start        # modo normal
```

Si todo está bien, vas a ver:

```
Servidor corriendo en http://localhost:3000
🕒 Tarea de recordatorios de turnos programada...
```

Dejá esa terminal abierta mientras uses la app.

### 9. Levantar el frontend

En **otra terminal**:

```bash
cd frontend
npm install
npm run dev
```

### 10. Entrar a la aplicación

Abrí **http://localhost:5173** en el navegador e iniciá sesión con el email y la contraseña que creaste en el paso 7.

### Resumen para el día a día

Una vez instalado, para volver a usar la app solo hace falta abrir dos terminales:

```bash
# Terminal 1
cd gestion-clinica/backend
npm start

# Terminal 2
cd gestion-clinica/frontend
npm run dev
```

y entrar a http://localhost:5173. SQL Server tiene que estar corriendo; normalmente arranca solo con Windows.

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

## Qué no se sube a GitHub

El `.gitignore` de la raíz excluye:

| Qué | Por qué |
|---|---|
| `node_modules/` | Son las dependencias; se vuelven a descargar con `npm install` |
| `.env` | Tiene contraseñas y claves; cada uno crea el suyo (paso 6) |
| `dist/` | Es el resultado de `npm run build`; se genera de nuevo |

---

## Comandos útiles

| Dónde | Comando | Qué hace |
|---|---|---|
| `backend/` | `npm run dev` | API en modo desarrollo (puerto 3000) |
| `backend/` | `npm start` | API en modo normal |
| `backend/` | `node createUser.js` | Crea un usuario de la aplicación (paso 7) |
| `backend/` | `node seeder.js` | Carga datos de prueba |
| `frontend/` | `npm run dev` | App web en modo desarrollo (puerto 5173) |
| `frontend/` | `npm run build` | Genera la versión de producción en `frontend/dist` |
| `frontend/` | `npm run lint` | Revisa el código con ESLint |

---

## Problemas comunes

| Síntoma | Causa y solución |
|---|---|
| `La variable de entorno DB_... no está definida` | Falta `backend/.env` o alguna variable `DB_*`. Ejecutá el backend **desde la carpeta `backend/`**, porque el `.env` se busca en la carpeta actual. |
| `Error al conectar a la base de datos` / `Login failed for user` | Revisá el paso 2 (autenticación mixta, TCP/IP, reinicio del servicio), el paso 5 (que exista el usuario de SQL) y los datos `DB_*` del `.env`. |
| `Failed to connect to localhost:1433` | El servicio de SQL Server está detenido, o TCP/IP no está habilitado. |
| Al iniciar sesión dice `Credenciales inválidas.` | Email o contraseña incorrectos, o el usuario no existe. Creá uno con el paso 7. |
| Al iniciar sesión dice que la cuenta está desactivada | El usuario tiene `Activo = 0`. Activalo con `UPDATE ... SET Activo = 1`. |
| Entro pero no veo ninguna pantalla / me manda a "No autorizado" | El rol del usuario no es exactamente `Administrador`, `Recepcionista` o `Deposito`. |
| El login falla con un error del servidor | Falta `JWT_SECRET` en el `.env`. |
| La web abre pero no trae datos | El backend no está corriendo, o no está en el puerto 3000 (la dirección `http://localhost:3000` está fija en el código del frontend). |
| `EADDRINUSE: address already in use :::3000` | Ya hay otro backend corriendo. Cerralo, o cerrá la terminal donde estaba. |
