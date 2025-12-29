USE [MDMSYSTEM];
GO


CREATE TABLE [dbo].[ObrasSociales](
	[ID_ObraSocial] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](150) NOT NULL,
	[Activo] [bit] NOT NULL DEFAULT 1,
PRIMARY KEY CLUSTERED
(
	[ID_ObraSocial] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY];
GO


CREATE TABLE [dbo].[Planes](
	[ID_Plan] [int] IDENTITY(1,1) NOT NULL,
	[ID_ObraSocial] [int] NOT NULL,
	[Nombre] [nvarchar](150) NOT NULL,
	[Activo] [bit] NOT NULL DEFAULT 1,
PRIMARY KEY CLUSTERED
(
	[ID_Plan] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY];
GO

ALTER TABLE [dbo].[Planes]  WITH CHECK ADD CONSTRAINT [FK_Planes_ObrasSociales] FOREIGN KEY([ID_ObraSocial])
REFERENCES [dbo].[ObrasSociales] ([ID_ObraSocial]);
GO

ALTER TABLE [dbo].[Planes] CHECK CONSTRAINT [FK_Planes_ObrasSociales];
GO



SET IDENTITY_INSERT [dbo].[ObrasSociales] ON;
INSERT INTO ObrasSociales (ID_ObraSocial, Nombre) VALUES
(1, N'OSDE'),
(2, N'Swiss Medical'),
(3, N'Galeno'),
(4, N'OSECAC'),
(5, N'PAMI'),
(6, N'APROSS'),
(7, N'Medifé'),
(8, N'OMINT'),
(9, N'Prevención Salud'),
(10, N'UOM'),
(11, N'UOCRA');
SET IDENTITY_INSERT [dbo].[ObrasSociales] OFF;
GO

SET IDENTITY_INSERT [dbo].[Planes] ON;
INSERT INTO Planes (ID_Plan, ID_ObraSocial, Nombre) VALUES

(1, 1, N'Plan 210'),
(2, 1, N'Plan 310'),
(3, 1, N'Plan 410'),
(4, 1, N'Plan 510'),
(5, 2, N'SMG20'),
(6, 2, N'SMG30'),
(7, 2, N'SMG50'),

(8, 3, N'Plata 220'),
(9, 3, N'Oro 330'),
(10, 3, N'Platino 440'),

(11, 4, N'Plan PMO'),
(12, 4, N'Plan Azul'),

(13, 5, N'Plan General'),

(14, 6, N'Plan Básico'),
(15, 6, N'Plan Plus'),

(16, 7, N'Plata'),
(17, 7, N'Oro'),
(18, 7, N'Platinum'),

(19, 8, N'Plan Clásico'),
(20, 8, N'Plan Global'),

(21, 9, N'Plan A1'),
(22, 9, N'Plan A2'),

(23, 10, N'Plan PMO'),

(24, 11, N'Plan PMO');
SET IDENTITY_INSERT [dbo].[Planes] OFF;
GO

ALTER TABLE Pacientes
ADD ID_ObraSocial INT NULL,
    ID_Plan INT NULL;
GO

ALTER TABLE Pacientes
ADD CONSTRAINT FK_Pacientes_ObrasSociales FOREIGN KEY (ID_ObraSocial)
REFERENCES ObrasSociales(ID_ObraSocial);
GO

ALTER TABLE Pacientes
ADD CONSTRAINT FK_Pacientes_Planes FOREIGN KEY (ID_Plan)
REFERENCES Planes(ID_Plan);
GO

UPDATE P
SET P.ID_ObraSocial = OS.ID_ObraSocial
FROM Pacientes P
JOIN ObrasSociales OS ON P.ObraSocial = OS.Nombre
WHERE P.ObraSocial IS NOT NULL AND P.ObraSocial != 'Particular';


UPDATE P
SET P.ID_Plan = PL.ID_Plan
FROM Pacientes P
JOIN Planes PL ON P.PlanObraSocial = PL.Nombre AND P.ID_ObraSocial = PL.ID_ObraSocial
WHERE P.PlanObraSocial IS NOT NULL;
GO

PRINT 'Script 009 completado exitosamente.';