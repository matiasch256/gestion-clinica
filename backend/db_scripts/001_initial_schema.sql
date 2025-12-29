/*
  PROYECTO: MDM System Database
  DESCRIPCION: Script de creación de estructura y población de datos (DDL + DML).
  NOTA: Todos los datos de pacientes, médicos y usuarios contenidos en este script
        son FICTICIOS (Mock Data) generados para propósitos de demostración y pruebas.
*/

USE [master]
GO

-- Limpieza previa: Si la BD existe, la borra para crearla limpia
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'MDMSYSTEM')
BEGIN
    ALTER DATABASE [MDMSYSTEM] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [MDMSYSTEM];
END
GO

CREATE DATABASE [MDMSYSTEM]
GO

USE [MDMSYSTEM]
GO

ALTER DATABASE [MDMSYSTEM] SET COMPATIBILITY_LEVEL = 150
GO
ALTER DATABASE [MDMSYSTEM] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [MDMSYSTEM] SET ANSI_NULLS OFF
GO
ALTER DATABASE [MDMSYSTEM] SET ANSI_PADDING OFF
GO
ALTER DATABASE [MDMSYSTEM] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [MDMSYSTEM] SET ARITHABORT OFF
GO
ALTER DATABASE [MDMSYSTEM] SET AUTO_CLOSE ON
GO
ALTER DATABASE [MDMSYSTEM] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [MDMSYSTEM] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [MDMSYSTEM] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [MDMSYSTEM] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [MDMSYSTEM] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [MDMSYSTEM] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [MDMSYSTEM] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [MDMSYSTEM] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [MDMSYSTEM] SET  ENABLE_BROKER
GO
ALTER DATABASE [MDMSYSTEM] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [MDMSYSTEM] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [MDMSYSTEM] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [MDMSYSTEM] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [MDMSYSTEM] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [MDMSYSTEM] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [MDMSYSTEM] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [MDMSYSTEM] SET RECOVERY SIMPLE
GO
ALTER DATABASE [MDMSYSTEM] SET  MULTI_USER
GO
ALTER DATABASE [MDMSYSTEM] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [MDMSYSTEM] SET DB_CHAINING OFF
GO
ALTER DATABASE [MDMSYSTEM] SET TARGET_RECOVERY_TIME = 60 SECONDS
GO
ALTER DATABASE [MDMSYSTEM] SET DELAYED_DURABILITY = DISABLED
GO
ALTER DATABASE [MDMSYSTEM] SET ACCELERATED_DATABASE_RECOVERY = OFF
GO
ALTER DATABASE [MDMSYSTEM] SET QUERY_STORE = OFF
GO

-- CREACION DE TABLAS --

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[categorias](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [nombre] [nvarchar](100) NOT NULL,
    [descripcion] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED
(
    [id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Compras](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [proveedor] [int] NOT NULL,
    [fecha] [date] NOT NULL,
    [estado] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED
(
    [id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DetalleCompra](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [IdCompra] [int] NOT NULL,
    [NombreProducto] [nvarchar](100) NOT NULL,
    [Cantidad] [int] NOT NULL,
    [Precio] [decimal](18, 2) NOT NULL,
PRIMARY KEY CLUSTERED
(
    [id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DetallesFacturaPaciente](
    [ID_DetalleFactura] [int] IDENTITY(1,1) NOT NULL,
    [ID_FacturaPaciente] [int] NOT NULL,
    [ID_Servicio] [int] NOT NULL,
    [Cantidad] [int] NOT NULL,
    [PrecioUnitario] [decimal](10, 2) NOT NULL,
    [SubTotal] [decimal](12, 2) NOT NULL,
PRIMARY KEY CLUSTERED
(
    [ID_DetalleFactura] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DetallesTurnoMedico](
    [ID_DetalleTurno] [int] IDENTITY(1,1) NOT NULL,
    [ID_TurnoMedico] [int] NOT NULL,
    [ID_Servicio] [int] NOT NULL,
    [Observaciones] [text] NULL,
    [EstadoProcedimiento] [varchar](100) NULL,
PRIMARY KEY CLUSTERED
(
    [ID_DetalleTurno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Especialidades](
    [ID_Especialidad] [int] IDENTITY(1,1) NOT NULL,
    [Nombre] [varchar](100) NOT NULL,
    [Descripcion] [varchar](255) NULL,
PRIMARY KEY CLUSTERED
(
    [ID_Especialidad] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EstadosFacturaPaciente](
    [ID_EstadoFactura] [int] IDENTITY(1,1) NOT NULL,
    [Descripcion] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED
(
    [ID_EstadoFactura] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EstadosTurnoMedico](
    [ID_EstadoTurno] [int] IDENTITY(1,1) NOT NULL,
    [Descripcion] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED
(
    [ID_EstadoTurno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FacturasPacientes](
    [ID_FacturaPaciente] [int] IDENTITY(1,1) NOT NULL,
    [FechaEmision] [datetime] NOT NULL,
    [TipoFactura] [varchar](20) NULL,
    [IVA] [decimal](5, 2) NULL,
    [Total] [decimal](12, 2) NOT NULL,
    [ID_Paciente] [int] NOT NULL,
    [ID_EstadoFactura] [int] NOT NULL,
PRIMARY KEY CLUSTERED
(
    [ID_FacturaPaciente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Medicos](
    [ID_Medico] [int] IDENTITY(1,1) NOT NULL,
    [Nombre] [varchar](100) NOT NULL,
    [Apellido] [varchar](100) NOT NULL,
    [Matricula] [varchar](50) NOT NULL,
    [Telefono] [varchar](25) NULL,
    [ID_Especialidad] [int] NULL,
PRIMARY KEY CLUSTERED
(
    [ID_Medico] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MetodosPago](
    [ID_MetodoPago] [int] IDENTITY(1,1) NOT NULL,
    [Nombre] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED
(
    [ID_MetodoPago] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pacientes](
    [ID_Paciente] [int] IDENTITY(1,1) NOT NULL,
    [Nombre] [varchar](100) NOT NULL,
    [Apellido] [varchar](100) NOT NULL,
    [Telefono] [varchar](25) NULL,
    [ObraSocial] [varchar](100) NULL,
PRIMARY KEY CLUSTERED
(
    [ID_Paciente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pagos](
    [ID_Pago] [int] IDENTITY(1,1) NOT NULL,
    [FechaPago] [datetime] NOT NULL,
    [Monto] [decimal](12, 2) NOT NULL,
    [ID_FacturaPaciente] [int] NOT NULL,
    [ID_MetodoPago] [int] NOT NULL,
PRIMARY KEY CLUSTERED
(
    [ID_Pago] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[productos](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [nombre] [nvarchar](100) NOT NULL,
    [descripcion] [nvarchar](255) NULL,
    [codigo] [nvarchar](50) NULL,
    [unidadMedida] [nvarchar](50) NOT NULL,
    [stock] [int] NOT NULL,
    [stockMinimo] [int] NOT NULL,
    [observaciones] [nvarchar](255) NULL,
    [activo] [bit] NOT NULL,
    [categoriaId] [int] NULL,
PRIMARY KEY CLUSTERED
(
    [id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[proveedores](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [nombre] [nvarchar](100) NOT NULL,
    [direccion] [nvarchar](150) NULL,
    [barrio] [nvarchar](100) NULL,
    [telefono] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED
(
    [id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Servicios](
    [ID_Servicio] [int] IDENTITY(1,1) NOT NULL,
    [Nombre] [varchar](150) NOT NULL,
    [Descripcion] [varchar](255) NULL,
    [CostoBase] [decimal](10, 2) NOT NULL,
    [ID_Especialidad] [int] NULL,
PRIMARY KEY CLUSTERED
(
    [ID_Servicio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TurnosMedicos](
    [ID_TurnoMedico] [int] IDENTITY(1,1) NOT NULL,
    [FechaHora] [datetime] NOT NULL,
    [Consultorio] [varchar](50) NULL,
    [ID_Paciente] [int] NOT NULL,
    [ID_Medico] [int] NOT NULL,
    [ID_EstadoTurno] [int] NOT NULL,
PRIMARY KEY CLUSTERED
(
    [ID_TurnoMedico] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuarios](
    [UsuarioID] [int] IDENTITY(1,1) NOT NULL,
    [Nombre] [nvarchar](100) NOT NULL,
    [Email] [nvarchar](255) NOT NULL,
    [PasswordHash] [nvarchar](255) NOT NULL,
    [Rol] [nvarchar](50) NOT NULL,
    [Activo] [bit] NOT NULL,
    [FechaCreacion] [datetime] NULL,
PRIMARY KEY CLUSTERED
(
    [UsuarioID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- INSERCION DE DATOS --

SET IDENTITY_INSERT [dbo].[categorias] ON

INSERT [dbo].[categorias] ([id], [nombre], [descripcion]) VALUES (1, N'Instrumental Quirúrgico', N'Elementos usados en cirugías')
INSERT [dbo].[categorias] ([id], [nombre], [descripcion]) VALUES (2, N'Descartables', N'Material descartable de uso clínico')
INSERT [dbo].[categorias] ([id], [nombre], [descripcion]) VALUES (3, N'Medicamentos y Soluciones', N'Soluciones intravenosas y antisépticos')
INSERT [dbo].[categorias] ([id], [nombre], [descripcion]) VALUES (4, N'Ropa Quirúrgica', N'Indumentaria de uso quirúrgico')
INSERT [dbo].[categorias] ([id], [nombre], [descripcion]) VALUES (9, N'Insumos Medicos', N'Productos para procedimientos medicos y quirurgicos')
INSERT [dbo].[categorias] ([id], [nombre], [descripcion]) VALUES (10, N'Equipamiento Médico', N'Herramientas y equipos médicos duraderos.')
SET IDENTITY_INSERT [dbo].[categorias] OFF
GO
SET IDENTITY_INSERT [dbo].[Compras] ON

INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (25, 8, CAST(N'2025-05-24' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (31, 9, CAST(N'2025-05-27' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (36, 8, CAST(N'2025-06-06' AS Date), N'Aprobada')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (38, 10, CAST(N'2024-06-06' AS Date), N'Cancelada')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (40, 8, CAST(N'2024-01-15' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (41, 9, CAST(N'2024-02-20' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (42, 10, CAST(N'2024-03-10' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (43, 11, CAST(N'2024-04-05' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (44, 12, CAST(N'2024-05-12' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (45, 13, CAST(N'2024-06-18' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (46, 14, CAST(N'2024-07-10' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (47, 15, CAST(N'2024-08-15' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (48, 16, CAST(N'2024-09-20' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (49, 17, CAST(N'2024-10-05' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (50, 18, CAST(N'2024-11-12' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (51, 20, CAST(N'2024-12-15' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (52, 8, CAST(N'2025-01-10' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (53, 9, CAST(N'2025-02-25' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (54, 10, CAST(N'2025-03-15' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (55, 11, CAST(N'2025-04-12' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (56, 12, CAST(N'2025-05-20' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (57, 8, CAST(N'2022-03-10' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (58, 9, CAST(N'2022-06-15' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (59, 10, CAST(N'2022-09-20' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (60, 11, CAST(N'2022-12-05' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (61, 12, CAST(N'2023-02-12' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (62, 13, CAST(N'2023-05-18' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (63, 14, CAST(N'2023-08-10' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (64, 15, CAST(N'2023-11-15' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (65, 16, CAST(N'2024-01-25' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (66, 17, CAST(N'2024-04-10' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (67, 18, CAST(N'2024-07-20' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (68, 8, CAST(N'2025-06-09' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (69, 22, CAST(N'2025-06-11' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (71, 10, CAST(N'2025-07-24' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (72, 8, CAST(N'2025-07-24' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (73, 8, CAST(N'2025-07-24' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (74, 24, CAST(N'2025-07-24' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (76, 8, CAST(N'2025-09-08' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (77, 9, CAST(N'2025-09-08' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (79, 9, CAST(N'2025-09-09' AS Date), N'Completada')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (80, 9, CAST(N'2025-09-09' AS Date), N'Pedido')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (81, 9, CAST(N'2025-09-09' AS Date), N'Aprobada')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (82, 9, CAST(N'2025-09-09' AS Date), N'Cancelada')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (83, 8, CAST(N'2025-09-09' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (85, 8, CAST(N'2025-09-09' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (87, 9, CAST(N'2025-09-09' AS Date), N'Pendiente')
INSERT [dbo].[Compras] ([id], [proveedor], [fecha], [estado]) VALUES (93, 8, CAST(N'2025-09-09' AS Date), N'Pendiente')
SET IDENTITY_INSERT [dbo].[Compras] OFF
GO
SET IDENTITY_INSERT [dbo].[DetalleCompra] ON

INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (42, 31, N'Campos quirúrgicos estériles', 6, CAST(50.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (46, 36, N'Agujas hipodérmicas 21G', 20, CAST(1000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (51, 38, N'Telas adhesivas estériles', 10, CAST(1000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (53, 40, N'Guantes quirúrgicos talle M', 10, CAST(15000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (54, 40, N'Jeringas 10 ml', 200, CAST(200.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (55, 40, N'Solución fisiológica 500 ml', 30, CAST(3000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (56, 41, N'Gasas estériles 10x10', 50, CAST(2500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (57, 41, N'Alcohol al 70%', 20, CAST(5000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (58, 41, N'Barbijos quirúrgicos', 300, CAST(80.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (59, 42, N'Bisturí descartable N°10', 50, CAST(600.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (60, 42, N'Sutura Nylon 3-0', 100, CAST(1500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (61, 42, N'Campos quirúrgicos estériles', 20, CAST(4000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (62, 43, N'Pervinox', 15, CAST(4000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (63, 43, N'Jeringas 5 ml', 150, CAST(180.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (64, 43, N'Telas adhesivas estériles', 50, CAST(800.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (65, 44, N'Batas descartables estériles', 20, CAST(3500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (66, 44, N'Agujas hipodérmicas 21G', 100, CAST(150.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (67, 44, N'Suero Ringer Lactato', 25, CAST(3500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (68, 45, N'Guantes quirúrgicos talle L', 15, CAST(16000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (69, 45, N'Cánulas endovenosas N°20', 50, CAST(800.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (70, 45, N'Termómetro digital', 5, CAST(6000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (71, 46, N'Sutura Catgut 2-0', 80, CAST(1700.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (72, 46, N'Gasas estériles 10x10', 40, CAST(2600.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (73, 46, N'Alcohol al 70%', 10, CAST(5500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (74, 47, N'Jeringas 10 ml', 150, CAST(210.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (75, 47, N'Campos quirúrgicos estériles', 15, CAST(4100.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (76, 47, N'Barbijos quirúrgicos', 200, CAST(85.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (77, 48, N'Bisturí descartable N°15', 40, CAST(650.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (78, 48, N'Solución fisiológica 500 ml', 20, CAST(3100.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (79, 48, N'Telas adhesivas estériles', 30, CAST(850.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (80, 49, N'Guantes quirúrgicos talle M', 12, CAST(15500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (81, 49, N'Pervinox', 10, CAST(4100.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (82, 49, N'Agujas hipodérmicas 21G', 80, CAST(160.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (83, 50, N'Batas descartables estériles', 15, CAST(3600.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (84, 50, N'Jeringas 5 ml', 100, CAST(190.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (85, 50, N'Barbijos quirúrgicos', 250, CAST(90.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (86, 51, N'Cánulas endovenosas N°20', 40, CAST(850.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (87, 51, N'Sutura Nylon 3-0', 60, CAST(1600.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (88, 51, N'Termómetro digital', 3, CAST(6200.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (89, 52, N'Guantes quirúrgicos talle M', 15, CAST(16000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (90, 52, N'Jeringas 10 ml', 250, CAST(220.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (91, 52, N'Solución fisiológica 500 ml', 40, CAST(3200.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (92, 53, N'Gasas estériles 10x10', 60, CAST(2600.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (93, 53, N'Alcohol al 70%', 25, CAST(5500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (94, 53, N'Barbijos quirúrgicos', 400, CAST(90.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (95, 54, N'Bisturí descartable N°10', 60, CAST(650.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (96, 54, N'Sutura Nylon 3-0', 120, CAST(1600.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (97, 54, N'Campos quirúrgicos estériles', 25, CAST(4200.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (98, 55, N'Pervinox', 20, CAST(4200.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (99, 55, N'Jeringas 5 ml', 200, CAST(190.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (100, 55, N'Telas adhesivas estériles', 60, CAST(850.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (101, 56, N'Batas descartables estériles', 25, CAST(3600.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (102, 56, N'Agujas hipodérmicas 21G', 150, CAST(160.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (103, 56, N'Suero Ringer Lactato', 30, CAST(3500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (104, 57, N'Guantes quirúrgicos talle M', 8, CAST(3656.25 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (105, 57, N'Jeringas 10 ml', 150, CAST(48.83 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (106, 57, N'Solución fisiológica 500 ml', 25, CAST(731.25 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (107, 58, N'Gasas estériles 10x10', 40, CAST(610.35 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (108, 58, N'Alcohol al 70%', 15, CAST(1219.51 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (109, 58, N'Barbijos quirúrgicos', 250, CAST(19.53 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (110, 59, N'Bisturí descartable N°10', 40, CAST(146.48 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (111, 59, N'Sutura Nylon 3-0', 80, CAST(365.63 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (112, 59, N'Campos quirúrgicos estériles', 15, CAST(975.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (113, 60, N'Pervinox', 10, CAST(975.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (114, 60, N'Jeringas 5 ml', 100, CAST(43.95 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (115, 60, N'Telas adhesivas estériles', 40, CAST(195.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (116, 61, N'Batas descartables estériles', 15, CAST(1367.19 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (117, 61, N'Agujas hipodérmicas 21G', 80, CAST(58.59 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (118, 61, N'Suero Ringer Lactato', 20, CAST(1367.19 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (119, 62, N'Guantes quirúrgicos talle L', 10, CAST(6250.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (120, 62, N'Cánulas endovenosas N°20', 40, CAST(312.50 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (121, 62, N'Termómetro digital', 3, CAST(2343.75 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (122, 63, N'Sutura Catgut 2-0', 60, CAST(664.06 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (123, 63, N'Gasas estériles 10x10', 30, CAST(1015.63 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (124, 63, N'Alcohol al 70%', 8, CAST(2148.44 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (125, 64, N'Jeringas 10 ml', 100, CAST(82.03 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (126, 64, N'Campos quirúrgicos estériles', 10, CAST(1601.56 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (127, 64, N'Barbijos quirúrgicos', 150, CAST(33.20 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (128, 65, N'Bisturí descartable N°15', 30, CAST(406.25 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (129, 65, N'Solución fisiológica 500 ml', 15, CAST(1937.50 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (130, 65, N'Telas adhesivas estériles', 25, CAST(531.25 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (131, 66, N'Guantes quirúrgicos talle M', 10, CAST(9687.50 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (132, 66, N'Pervinox', 8, CAST(2562.50 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (133, 66, N'Agujas hipodérmicas 21G', 60, CAST(100.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (134, 67, N'Batas descartables estériles', 12, CAST(2250.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (135, 67, N'Jeringas 5 ml', 80, CAST(118.75 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (136, 67, N'Barbijos quirúrgicos', 200, CAST(56.25 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (141, 25, N'Alcohol al 70%', 8, CAST(983.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (142, 68, N'Alcohol al 70%', 2, CAST(983.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (143, 69, N'Guantes quirúrgicos talle M', 700, CAST(1500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (146, 71, N'Barbijos quirúrgicos', 40, CAST(100.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (147, 72, N'Guantes quirúrgicos talle M', 30, CAST(15000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (148, 73, N'Alcohol al 70%', 20, CAST(983.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (149, 74, N'Gasas Esteriles', 10, CAST(1000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (151, 76, N'Pervinox', 100, CAST(450.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (152, 77, N'Alcohol al 70%', 10, CAST(1200.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (154, 79, N'Máscara N95', 100, CAST(1500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (155, 80, N'Máscara N95', 100, CAST(1500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (156, 81, N'Suero Ringer Lactato', 12, CAST(121212.00 AS Decimal(18, 2)))
GO
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (157, 82, N'Solución fisiológica 500 ml', 100, CAST(1500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (158, 83, N'Bisturí descartable N°15', 100, CAST(1520.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (160, 85, N'Guantes quirúrgicos talle L', 1, CAST(20000.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (162, 87, N'Pervinox', 10, CAST(1500.00 AS Decimal(18, 2)))
INSERT [dbo].[DetalleCompra] ([id], [IdCompra], [NombreProducto], [Cantidad], [Precio]) VALUES (168, 93, N'Máscara N95', 200, CAST(2850.00 AS Decimal(18, 2)))
SET IDENTITY_INSERT [dbo].[DetalleCompra] OFF
GO
SET IDENTITY_INSERT [dbo].[DetallesFacturaPaciente] ON

INSERT [dbo].[DetallesFacturaPaciente] ([ID_DetalleFactura], [ID_FacturaPaciente], [ID_Servicio], [Cantidad], [PrecioUnitario], [SubTotal]) VALUES (1, 1, 1, 1, CAST(15000.00 AS Decimal(10, 2)), CAST(15000.00 AS Decimal(12, 2)))
INSERT [dbo].[DetallesFacturaPaciente] ([ID_DetalleFactura], [ID_FacturaPaciente], [ID_Servicio], [Cantidad], [PrecioUnitario], [SubTotal]) VALUES (2, 1, 6, 1, CAST(15000.00 AS Decimal(10, 2)), CAST(15000.00 AS Decimal(12, 2)))
INSERT [dbo].[DetallesFacturaPaciente] ([ID_DetalleFactura], [ID_FacturaPaciente], [ID_Servicio], [Cantidad], [PrecioUnitario], [SubTotal]) VALUES (3, 2, 1, 1, CAST(15000.00 AS Decimal(10, 2)), CAST(15000.00 AS Decimal(12, 2)))
SET IDENTITY_INSERT [dbo].[DetallesFacturaPaciente] OFF
GO
SET IDENTITY_INSERT [dbo].[DetallesTurnoMedico] ON

INSERT [dbo].[DetallesTurnoMedico] ([ID_DetalleTurno], [ID_TurnoMedico], [ID_Servicio], [Observaciones], [EstadoProcedimiento]) VALUES (1, 1, 1, N'Paciente refiere dolor en rodilla derecha. Se solicita resonancia.', N'Realizado')
INSERT [dbo].[DetallesTurnoMedico] ([ID_DetalleTurno], [ID_TurnoMedico], [ID_Servicio], [Observaciones], [EstadoProcedimiento]) VALUES (2, 2, 1, N'Seguimiento post-operatorio de fractura de tobillo.', N'Realizado')
INSERT [dbo].[DetallesTurnoMedico] ([ID_DetalleTurno], [ID_TurnoMedico], [ID_Servicio], [Observaciones], [EstadoProcedimiento]) VALUES (3, 3, 5, N'Ejercicios de fortalecimiento para lumbar.', N'Realizado')
INSERT [dbo].[DetallesTurnoMedico] ([ID_DetalleTurno], [ID_TurnoMedico], [ID_Servicio], [Observaciones], [EstadoProcedimiento]) VALUES (4, 4, 6, N'Paciente recibe aplicación de Acido Zolendronico según protocolo.', N'Realizado')
SET IDENTITY_INSERT [dbo].[DetallesTurnoMedico] OFF
GO
SET IDENTITY_INSERT [dbo].[Especialidades] ON

INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (1, N'Traumatologo', N'Especialidad en lesiones del aparato locomotor.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (2, N'Cirujano General', N'Especialidad en procedimientos quirúrgicos generales.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (3, N'Urologo', N'Especialidad en el sistema urinario y reproductor masculino.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (4, N'Clinico Medico', N'Atención médica primaria y general.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (5, N'Gastroenterologo', N'Especialidad en el sistema digestivo.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (6, N'Neurocirujano', N'Especialidad en cirugía del sistema nervioso.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (7, N'Dermatologo', N'Especialidad en enfermedades de la piel.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (8, N'Ecografa', N'Especialista en diagnóstico por ultrasonido.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (9, N'Ortopedista', N'Especialista en corrección de deformidades óseas.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (10, N'Cardiologo', N'Especialidad en enfermedades del corazón.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (11, N'Ginecologo', N'Especialidad en salud del sistema reproductor femenino.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (12, N'Otorrinolaringologo', N'Especialidad en oído, nariz y garganta.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (13, N'Cirujano Plastico', N'Especialidad en cirugía reconstructiva y estética.')
INSERT [dbo].[Especialidades] ([ID_Especialidad], [Nombre], [Descripcion]) VALUES (14, N'Kinesiologo', N'Especialidad en rehabilitación física y movimiento.')
SET IDENTITY_INSERT [dbo].[Especialidades] OFF
GO
SET IDENTITY_INSERT [dbo].[EstadosFacturaPaciente] ON

INSERT [dbo].[EstadosFacturaPaciente] ([ID_EstadoFactura], [Descripcion]) VALUES (3, N'Anulada')
INSERT [dbo].[EstadosFacturaPaciente] ([ID_EstadoFactura], [Descripcion]) VALUES (2, N'Pagada')
INSERT [dbo].[EstadosFacturaPaciente] ([ID_EstadoFactura], [Descripcion]) VALUES (1, N'Pendiente de Pago')
SET IDENTITY_INSERT [dbo].[EstadosFacturaPaciente] OFF
GO
SET IDENTITY_INSERT [dbo].[EstadosTurnoMedico] ON

INSERT [dbo].[EstadosTurnoMedico] ([ID_EstadoTurno], [Descripcion]) VALUES (4, N'Ausente')
INSERT [dbo].[EstadosTurnoMedico] ([ID_EstadoTurno], [Descripcion]) VALUES (5, N'Cancelado')
INSERT [dbo].[EstadosTurnoMedico] ([ID_EstadoTurno], [Descripcion]) VALUES (3, N'Completado')
INSERT [dbo].[EstadosTurnoMedico] ([ID_EstadoTurno], [Descripcion]) VALUES (2, N'En espera')
INSERT [dbo].[EstadosTurnoMedico] ([ID_EstadoTurno], [Descripcion]) VALUES (1, N'Programado')
SET IDENTITY_INSERT [dbo].[EstadosTurnoMedico] OFF
GO
SET IDENTITY_INSERT [dbo].[FacturasPacientes] ON

INSERT [dbo].[FacturasPacientes] ([ID_FacturaPaciente], [FechaEmision], [TipoFactura], [IVA], [Total], [ID_Paciente], [ID_EstadoFactura]) VALUES (1, CAST(N'2024-09-02T18:00:00.000' AS DateTime), N'B', CAST(0.00 AS Decimal(5, 2)), CAST(24500.00 AS Decimal(12, 2)), 1, 2)
INSERT [dbo].[FacturasPacientes] ([ID_FacturaPaciente], [FechaEmision], [TipoFactura], [IVA], [Total], [ID_Paciente], [ID_EstadoFactura]) VALUES (2, CAST(N'2024-03-18T12:00:00.000' AS DateTime), N'B', CAST(0.00 AS Decimal(5, 2)), CAST(15000.00 AS Decimal(12, 2)), 2, 1)
SET IDENTITY_INSERT [dbo].[FacturasPacientes] OFF
GO
SET IDENTITY_INSERT [dbo].[Medicos] ON

INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (1, N'Walter Ruben', N'Guiliano', N'MN1001', N'1158473625', 1)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (2, N'Juan Carlos', N'Piazzolla', N'MN1002', N'1168392716', 13)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (3, N'Alejandro Francisco', N'Scholz', N'MN1003', N'1157382910', 6)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (4, N'Javes', N'Martin', N'MN1004', N'1147291827', 2)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (5, N'Nicolas', N'Martin', N'MN1005', N'1169381625', 3)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (6, N'Ramiro', N'Juan Alberto', N'MN1006', N'1158392817', 5)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (7, N'Emiliano', N'Centurion', N'MN1007', N'1168392817', 1)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (8, N'Ulises', N'Chavanne', N'MN1008', N'1148201938', 7)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (9, N'German Matias', N'Joannas', N'MN1009', N'1159302918', 1)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (10, N'Diego', N'Kyle', N'MN1010', N'1169381726', 10)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (11, N'Ignacio', N'Perez', N'MP2001', N'1159381625', 14)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (12, N'Pablo', N'Rupenian', N'MP2002', N'1168372615', 14)
INSERT [dbo].[Medicos] ([ID_Medico], [Nombre], [Apellido], [Matricula], [Telefono], [ID_Especialidad]) VALUES (13, N'Silvana Nancy', N'Hugo', N'MN1011', N'1157382819', 11)
SET IDENTITY_INSERT [dbo].[Medicos] OFF
GO
SET IDENTITY_INSERT [dbo].[MetodosPago] ON

INSERT [dbo].[MetodosPago] ([ID_MetodoPago], [Nombre]) VALUES (1, N'Efectivo')
INSERT [dbo].[MetodosPago] ([ID_MetodoPago], [Nombre]) VALUES (5, N'Mercado Pago')
INSERT [dbo].[MetodosPago] ([ID_MetodoPago], [Nombre]) VALUES (2, N'Tarjeta de Credito')
INSERT [dbo].[MetodosPago] ([ID_MetodoPago], [Nombre]) VALUES (3, N'Tarjeta de Debito')
INSERT [dbo].[MetodosPago] ([ID_MetodoPago], [Nombre]) VALUES (4, N'Transferencia Bancaria')
SET IDENTITY_INSERT [dbo].[MetodosPago] OFF
GO
SET IDENTITY_INSERT [dbo].[Pacientes] ON

INSERT [dbo].[Pacientes] ([ID_Paciente], [Nombre], [Apellido], [Telefono], [ObraSocial]) VALUES (1, N'Nicolas', N'Valiente', N'1159873456', N'OSDE')
INSERT [dbo].[Pacientes] ([ID_Paciente], [Nombre], [Apellido], [Telefono], [ObraSocial]) VALUES (2, N'Marisol', N'Velastegui', N'1167891234', N'Swiss Medical')
INSERT [dbo].[Pacientes] ([ID_Paciente], [Nombre], [Apellido], [Telefono], [ObraSocial]) VALUES (3, N'Paula', N'Feito', N'1145678901', N'IOMA')
INSERT [dbo].[Pacientes] ([ID_Paciente], [Nombre], [Apellido], [Telefono], [ObraSocial]) VALUES (4, N'Carlos', N'Gomez', N'1156781234', N'Particular')
INSERT [dbo].[Pacientes] ([ID_Paciente], [Nombre], [Apellido], [Telefono], [ObraSocial]) VALUES (5, N'Laura', N'Martinez', N'1165439876', N'PAMI')
INSERT [dbo].[Pacientes] ([ID_Paciente], [Nombre], [Apellido], [Telefono], [ObraSocial]) VALUES (6, N'Javier', N'Rodriguez', N'1143215678', N'Galeno')
INSERT [dbo].[Pacientes] ([ID_Paciente], [Nombre], [Apellido], [Telefono], [ObraSocial]) VALUES (7, N'Sofia', N'Lopez', N'1154328765', N'PAMI')
INSERT [dbo].[Pacientes] ([ID_Paciente], [Nombre], [Apellido], [Telefono], [ObraSocial]) VALUES (8, N'Matias', N'Fernandez', N'1167894321', N'OSDE')
SET IDENTITY_INSERT [dbo].[Pacientes] OFF
GO
SET IDENTITY_INSERT [dbo].[Pagos] ON

INSERT [dbo].[Pagos] ([ID_Pago], [FechaPago], [Monto], [ID_FacturaPaciente], [ID_MetodoPago]) VALUES (1, CAST(N'2024-09-02T18:05:00.000' AS DateTime), CAST(24500.00 AS Decimal(12, 2)), 1, 1)
SET IDENTITY_INSERT [dbo].[Pagos] OFF
GO
SET IDENTITY_INSERT [dbo].[productos] ON

INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (1, N'Guantes quirúrgicos talle M', N'Guantes estériles de látex, talla mediana', N'GQ-M-001', N'caja', 40, 100, N'Uso exclusivo quirófano', 1, 2)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (2, N'Guantes quirúrgicos talle L', N'Guantes estériles de látex, talla grande', N'GQ-L-002', N'caja', 35, 10, N'Uso exclusivo quirófano', 1, 2)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (3, N'Jeringas 10 ml', N'Jeringas descartables con aguja', N'JER-10ML-003', N'unidad', 300, 100, N'Esterilizadas', 1, 2)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (4, N'Jeringas 5 ml', N'Jeringas descartables con aguja', N'JER-5ML-004', N'unidad', 250, 80, N'Esterilizadas', 1, 2)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (5, N'Bisturí descartable N°10', N'Bisturí de acero inoxidable', N'BIS-10-005', N'unidad', 120, 150, N'Quirófano', 1, 1)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (6, N'Bisturí descartable N°15', N'Bisturí de acero inoxidable', N'BIS-15-006', N'unidad', 100, 25, N'Quirófano', 1, 1)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (7, N'Gasas estériles 10x10', N'Gasas empaquetadas', N'GAS-10X10-007', N'paquete', 80, 20, N'Uso quirúrgico', 1, 2)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (8, N'Alcohol al 70%', N'Alcohol líquido para desinfección', N'ALC-70-008', N'litro', 50, 15, N'Uso general', 1, 3)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (9, N'Pervinox', N'Solución tópica antiséptica', N'PER-009', N'frasco', 40, 10, N'Uso prequirúrgico', 1, 3)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (10, N'Solución fisiológica 500 ml', N'Solución estéril de cloruro de sodio', N'SOL-FIS-500-010', N'frasco', 60, 3, N'Uso intravenoso', 1, 3)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (11, N'Suero Ringer Lactato', N'Solución intravenosa balanceada', N'RIN-LAC-011', N'frasco', 40, 10, N'Uso quirúrgico', 1, 3)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (12, N'Sutura Nylon 3-0', N'Hilo de sutura no absorbible', N'SUT-NYL-3-012', N'unidad', 150, 50, N'Uso en piel', 1, 1)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (13, N'Sutura Catgut 2-0', N'Hilo de sutura absorbible', N'SUT-CAT-2-013', N'unidad', 130, 40, N'Uso interno', 1, 1)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (14, N'Campos quirúrgicos estériles', N'Tela estéril para cubrir paciente', N'CAM-QUI-014', N'unidad', 70, 20, N'Uso exclusivo quirófano', 1, 4)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (15, N'Barbijos quirúrgicos', N'Triple capa, descartables', N'BAR-QUI-015', N'unidad', 500, 150, N'Uso obligatorio en procedimientos', 1, 4)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (16, N'Batas descartables estériles', N'Ropa descartable para quirófano', N'BAT-DES-016', N'unidad', 60, 15, N'Uso quirúrgico', 1, 4)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (17, N'Telas adhesivas estériles', N'Para fijación de catéteres y apósitos', N'TEL-ADH-017', N'unidad', 90, 20, N'Uso postoperatorio', 1, 2)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (18, N'Agujas hipodérmicas 21G', N'Para inyección intramuscular', N'AGU-21G-018', N'unidad', 200, 60, N'Uso general', 1, 2)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (19, N'Cánulas endovenosas N°20', N'Catéter para acceso venoso', N'CAN-END-20-019', N'unidad', 100, 30, N'Uso intravenoso', 1, 2)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (42, N'guante de proteccion', N'latex', NULL, N'L', 10, 5, NULL, 1, NULL)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (44, N'Mascarilas quirurgicas', N'Mascarilla de 3 capas', NULL, N'Caja 50 unidades', 5, 10, NULL, 1, NULL)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (46, N'Máscara N95', N'Barbijo con filtro para uso médico y quirúrgico', N'JN55', N'Unidad', 150, 50, N'', 1, NULL)
INSERT [dbo].[productos] ([id], [nombre], [descripcion], [codigo], [unidadMedida], [stock], [stockMinimo], [observaciones], [activo], [categoriaId]) VALUES (47, N'Gasas Esteriles', N'Paquete de gasas', NULL, N'1', 150, 50, NULL, 1, NULL)
SET IDENTITY_INSERT [dbo].[productos] OFF
GO
SET IDENTITY_INSERT [dbo].[proveedores] ON

INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (8, N'Distribuidora El Sol', N'Av. Rivadavia 1234', N'Caballito', N'011-4567-1234')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (9, N'Proveeduría Central', N'Calle Mitre 567', N'San Telmo', N'011-4321-5678')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (10, N'Comercial La Plata', N'Av. 7 N°456', N'La Plata', N'0221-478-9900')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (11, N'Almacén Norte', N'Ruta 8 Km 45', N'Pilar', N'0230-457-2233')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (12, N'Mercado del Oeste', N'San Martín 789', N'Morón', N'011-4699-3322')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (13, N'Grupo Proveedor Sur', N'Av. Calchaquí 2500', N'Quilmes', N'011-4250-8899')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (14, N'Distribuciones Patagónicas', N'Mitre 456', N'Bariloche', N'0294-443-1122')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (15, N'Mayorista Cuyo', N'Av. Libertador 900', N'San Juan', N'0264-421-7788')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (16, N'Proveedor Andes', N'Belgrano 1220', N'Mendoza Centro', N'0261-429-5588')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (17, N'SurtiPro', N'Av. Alem 1341', N'Bahía Blanca', N'0291-452-6677')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (18, N'Distribuidora Lean', N'San Martin 444', N'Ituzaingo ', N'0116555589')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (20, N'Guantes sa', N'el arañado ', N'santa isabel', N'3513230234')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (21, N'Porta', N'Av Corrientes 2450', N'Caballito', N'+54351495123333')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (22, N'MediSur S.A', N'Av. Corrientes 2450', N'Balvanera', N'+543512356111')
INSERT [dbo].[proveedores] ([id], [nombre], [direccion], [barrio], [telefono]) VALUES (24, N'MediPlus', N'Av. Juan B. Justo', N'Villa Crespo', N'011332345')
SET IDENTITY_INSERT [dbo].[proveedores] OFF
GO
SET IDENTITY_INSERT [dbo].[Servicios] ON

INSERT [dbo].[Servicios] ([ID_Servicio], [Nombre], [Descripcion], [CostoBase], [ID_Especialidad]) VALUES (1, N'Consulta Traumatologica', N'Evaluación y diagnóstico de lesiones traumatológicas.', CAST(15000.00 AS Decimal(10, 2)), 1)
INSERT [dbo].[Servicios] ([ID_Servicio], [Nombre], [Descripcion], [CostoBase], [ID_Especialidad]) VALUES (2, N'Consulta Urologia', N'Evaluación del sistema urinario.', CAST(15000.00 AS Decimal(10, 2)), 3)
INSERT [dbo].[Servicios] ([ID_Servicio], [Nombre], [Descripcion], [CostoBase], [ID_Especialidad]) VALUES (3, N'Consulta Clinica General', N'Atención primaria y seguimiento.', CAST(15000.00 AS Decimal(10, 2)), 4)
INSERT [dbo].[Servicios] ([ID_Servicio], [Nombre], [Descripcion], [CostoBase], [ID_Especialidad]) VALUES (4, N'Consulta Cardiologia', N'Evaluación del sistema cardiovascular.', CAST(20000.00 AS Decimal(10, 2)), 10)
INSERT [dbo].[Servicios] ([ID_Servicio], [Nombre], [Descripcion], [CostoBase], [ID_Especialidad]) VALUES (5, N'Sesion de Kinesiologia', N'Tratamiento de rehabilitación física.', CAST(8000.00 AS Decimal(10, 2)), 14)
INSERT [dbo].[Servicios] ([ID_Servicio], [Nombre], [Descripcion], [CostoBase], [ID_Especialidad]) VALUES (6, N'Aplicacion Acido Zolendronico', N'Tratamiento para la osteoporosis.', CAST(15000.00 AS Decimal(10, 2)), 1)
INSERT [dbo].[Servicios] ([ID_Servicio], [Nombre], [Descripcion], [CostoBase], [ID_Especialidad]) VALUES (7, N'Ecografia Doppler', N'Estudio de diagnóstico por imágenes.', CAST(18000.00 AS Decimal(10, 2)), 8)
SET IDENTITY_INSERT [dbo].[Servicios] OFF
GO
SET IDENTITY_INSERT [dbo].[TurnosMedicos] ON

INSERT [dbo].[TurnosMedicos] ([ID_TurnoMedico], [FechaHora], [Consultorio], [ID_Paciente], [ID_Medico], [ID_EstadoTurno]) VALUES (1, CAST(N'2024-03-18T10:00:00.000' AS DateTime), N'Consultorio 1', 1, 3, 3)
INSERT [dbo].[TurnosMedicos] ([ID_TurnoMedico], [FechaHora], [Consultorio], [ID_Paciente], [ID_Medico], [ID_EstadoTurno]) VALUES (2, CAST(N'2024-03-18T11:30:00.000' AS DateTime), N'Consultorio 5', 2, 7, 3)
INSERT [dbo].[TurnosMedicos] ([ID_TurnoMedico], [FechaHora], [Consultorio], [ID_Paciente], [ID_Medico], [ID_EstadoTurno]) VALUES (3, CAST(N'2024-03-19T09:00:00.000' AS DateTime), N'Consultorio 2', 3, 12, 3)
INSERT [dbo].[TurnosMedicos] ([ID_TurnoMedico], [FechaHora], [Consultorio], [ID_Paciente], [ID_Medico], [ID_EstadoTurno]) VALUES (4, CAST(N'2024-03-20T15:00:00.000' AS DateTime), N'Consultorio 3', 1, 1, 3)
INSERT [dbo].[TurnosMedicos] ([ID_TurnoMedico], [FechaHora], [Consultorio], [ID_Paciente], [ID_Medico], [ID_EstadoTurno]) VALUES (5, CAST(N'2024-03-21T16:00:00.000' AS DateTime), N'Consultorio 4', 4, 10, 4)
INSERT [dbo].[TurnosMedicos] ([ID_TurnoMedico], [FechaHora], [Consultorio], [ID_Paciente], [ID_Medico], [ID_EstadoTurno]) VALUES (6, CAST(N'2025-09-10T14:30:00.000' AS DateTime), N'Consultorio 2', 5, 13, 1)
INSERT [dbo].[TurnosMedicos] ([ID_TurnoMedico], [FechaHora], [Consultorio], [ID_Paciente], [ID_Medico], [ID_EstadoTurno]) VALUES (7, CAST(N'2025-09-12T11:00:00.000' AS DateTime), N'Consultorio 1', 6, 1, 1)
INSERT [dbo].[TurnosMedicos] ([ID_TurnoMedico], [FechaHora], [Consultorio], [ID_Paciente], [ID_Medico], [ID_EstadoTurno]) VALUES (8, CAST(N'2025-09-10T08:30:00.000' AS DateTime), NULL, 1, 1, 1)
SET IDENTITY_INSERT [dbo].[TurnosMedicos] OFF
GO
SET IDENTITY_INSERT [dbo].[Usuarios] ON

INSERT [dbo].[Usuarios] ([UsuarioID], [Nombre], [Email], [PasswordHash], [Rol], [Activo], [FechaCreacion]) VALUES (1, N'Administrador del Sistema', N'matias32@gmail.com', N'$2b$10$W5rqM.a7TzND71kTGnIh..uiDrJhe.f/yb6EWhzZl9fP4ak68iQH.', N'Administrador', 1, CAST(N'2025-09-02T15:21:01.523' AS DateTime))
INSERT [dbo].[Usuarios] ([UsuarioID], [Nombre], [Email], [PasswordHash], [Rol], [Activo], [FechaCreacion]) VALUES (2, N'Laura', N'laura_barrancas@gmail.com', N'$2b$10$9ruPaG2EgZZmgbvtxAJgqehQX7QzjNBhWu.wk3ojil/MX98IFxNGK', N'Administrador', 1, CAST(N'2025-09-06T14:48:05.520' AS DateTime))
SET IDENTITY_INSERT [dbo].[Usuarios] OFF
GO

-- INDICES Y RESTRICCIONES --

SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[categorias] ADD UNIQUE NONCLUSTERED
(
    [nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[Especialidades] ADD UNIQUE NONCLUSTERED
(
    [Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[EstadosFacturaPaciente] ADD UNIQUE NONCLUSTERED
(
    [Descripcion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[EstadosTurnoMedico] ADD UNIQUE NONCLUSTERED
(
    [Descripcion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[Medicos] ADD UNIQUE NONCLUSTERED
(
    [Matricula] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[MetodosPago] ADD UNIQUE NONCLUSTERED
(
    [Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[Usuarios] ADD UNIQUE NONCLUSTERED
(
    [Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Compras]  ADD  DEFAULT ('Pendiente') FOR [estado]
GO
ALTER TABLE [dbo].[DetallesFacturaPaciente]  ADD  DEFAULT ((1)) FOR [Cantidad]
GO
ALTER TABLE [dbo].[FacturasPacientes]  ADD  DEFAULT (getdate()) FOR [FechaEmision]
GO
ALTER TABLE [dbo].[productos]  ADD  DEFAULT ((1)) FOR [activo]
GO
ALTER TABLE [dbo].[Usuarios]  ADD  DEFAULT ('Administrador') FOR [Rol]
GO
ALTER TABLE [dbo].[Usuarios]  ADD  DEFAULT ((1)) FOR [Activo]
GO
ALTER TABLE [dbo].[Usuarios]  ADD  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[Compras]  WITH CHECK ADD FOREIGN KEY([proveedor])
REFERENCES [dbo].[proveedores] ([id])
GO
ALTER TABLE [dbo].[DetalleCompra]  WITH CHECK ADD FOREIGN KEY([IdCompra])
REFERENCES [dbo].[Compras] ([id])
GO
ALTER TABLE [dbo].[DetallesFacturaPaciente]  WITH CHECK ADD FOREIGN KEY([ID_FacturaPaciente])
REFERENCES [dbo].[FacturasPacientes] ([ID_FacturaPaciente])
GO
ALTER TABLE [dbo].[DetallesFacturaPaciente]  WITH CHECK ADD FOREIGN KEY([ID_Servicio])
REFERENCES [dbo].[Servicios] ([ID_Servicio])
GO
ALTER TABLE [dbo].[DetallesTurnoMedico]  WITH CHECK ADD FOREIGN KEY([ID_Servicio])
REFERENCES [dbo].[Servicios] ([ID_Servicio])
GO
ALTER TABLE [dbo].[DetallesTurnoMedico]  WITH CHECK ADD FOREIGN KEY([ID_TurnoMedico])
REFERENCES [dbo].[TurnosMedicos] ([ID_TurnoMedico])
GO
ALTER TABLE [dbo].[FacturasPacientes]  WITH CHECK ADD FOREIGN KEY([ID_EstadoFactura])
REFERENCES [dbo].[EstadosFacturaPaciente] ([ID_EstadoFactura])
GO
ALTER TABLE [dbo].[FacturasPacientes]  WITH CHECK ADD FOREIGN KEY([ID_Paciente])
REFERENCES [dbo].[Pacientes] ([ID_Paciente])
GO
ALTER TABLE [dbo].[Medicos]  WITH CHECK ADD FOREIGN KEY([ID_Especialidad])
REFERENCES [dbo].[Especialidades] ([ID_Especialidad])
GO
ALTER TABLE [dbo].[Pagos]  WITH CHECK ADD FOREIGN KEY([ID_FacturaPaciente])
REFERENCES [dbo].[FacturasPacientes] ([ID_FacturaPaciente])
GO
ALTER TABLE [dbo].[Pagos]  WITH CHECK ADD FOREIGN KEY([ID_MetodoPago])
REFERENCES [dbo].[MetodosPago] ([ID_MetodoPago])
GO
ALTER TABLE [dbo].[productos]  WITH CHECK ADD  CONSTRAINT [FK_productos_categorias] FOREIGN KEY([categoriaId])
REFERENCES [dbo].[categorias] ([id])
GO
ALTER TABLE [dbo].[productos] CHECK CONSTRAINT [FK_productos_categorias]
GO
ALTER TABLE [dbo].[Servicios]  WITH CHECK ADD FOREIGN KEY([ID_Especialidad])
REFERENCES [dbo].[Especialidades] ([ID_Especialidad])
GO
ALTER TABLE [dbo].[TurnosMedicos]  WITH CHECK ADD FOREIGN KEY([ID_EstadoTurno])
REFERENCES [dbo].[EstadosTurnoMedico] ([ID_EstadoTurno])
GO
ALTER TABLE [dbo].[TurnosMedicos]  WITH CHECK ADD FOREIGN KEY([ID_Medico])
REFERENCES [dbo].[Medicos] ([ID_Medico])
GO
ALTER TABLE [dbo].[TurnosMedicos]  WITH CHECK ADD FOREIGN KEY([ID_Paciente])
REFERENCES [dbo].[Pacientes] ([ID_Paciente])
GO
USE [master]
GO
ALTER DATABASE [MDMSYSTEM] SET  READ_WRITE
GO
