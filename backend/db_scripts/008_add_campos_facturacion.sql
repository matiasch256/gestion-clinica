USE [MDMSYSTEM];
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE Name = N'NumeroFactura' AND Object_ID = OBJECT_ID(N'FacturasPacientes')
)
BEGIN
    ALTER TABLE FacturasPacientes
    ADD NumeroFactura VARCHAR(50) NULL;
    PRINT 'Columna NumeroFactura agregada.';
END
ELSE
BEGIN
    PRINT 'Columna NumeroFactura ya existía.';
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE Name = N'ID_MetodoPago' AND Object_ID = OBJECT_ID(N'FacturasPacientes')
)
BEGIN
    ALTER TABLE FacturasPacientes
    ADD ID_MetodoPago INT NULL;
    PRINT 'Columna ID_MetodoPago agregada.';
END
ELSE
BEGIN
    PRINT 'Columna ID_MetodoPago ya existía.';
END
GO


IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys
    WHERE Name = N'FK_Facturas_MetodosPago' AND parent_object_id = OBJECT_ID(N'FacturasPacientes')
)
BEGIN
    ALTER TABLE FacturasPacientes
    ADD CONSTRAINT FK_Facturas_MetodosPago FOREIGN KEY (ID_MetodoPago)
    REFERENCES MetodosPago(ID_MetodoPago);
    PRINT 'Constraint FK_Facturas_MetodosPago agregado.';
END
ELSE
BEGIN
    PRINT 'Constraint FK_Facturas_MetodosPago ya existía.';
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.indexes
    WHERE Name = N'UQ_Facturas_NumeroFactura_NotNull' AND object_id = OBJECT_ID(N'FacturasPacientes')
)
BEGIN
    CREATE UNIQUE INDEX UQ_Facturas_NumeroFactura_NotNull
    ON FacturasPacientes(NumeroFactura)
    WHERE NumeroFactura IS NOT NULL;
    PRINT 'Índice UQ_Facturas_NumeroFactura_NotNull creado.';
END
ELSE
BEGIN
    PRINT 'Índice UQ_Facturas_NumeroFactura_NotNull ya existía.';
END
GO