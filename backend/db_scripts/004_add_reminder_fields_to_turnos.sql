ALTER TABLE TurnosMedicos
ADD RecordatorioEnviado BIT NOT NULL DEFAULT 0;


ALTER TABLE TurnosMedicos
ADD FechaEnvioRecordatorio DATETIME NULL;


ALTER TABLE TurnosMedicos
ADD ErrorRecordatorio NVARCHAR(MAX) NULL;