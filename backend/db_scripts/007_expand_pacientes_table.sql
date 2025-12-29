ALTER TABLE Pacientes
ADD FechaNacimiento DATE NULL,
    Genero VARCHAR(50) NULL,
    EstadoCivil VARCHAR(50) NULL,
    Celular VARCHAR(50) NULL,
    Direccion VARCHAR(255) NULL,
    Ciudad VARCHAR(100) NULL,
    Provincia VARCHAR(100) NULL,
    CodigoPostal VARCHAR(20) NULL,
    NumeroAfiliado VARCHAR(100) NULL,
    PlanObraSocial VARCHAR(100) NULL;
GO