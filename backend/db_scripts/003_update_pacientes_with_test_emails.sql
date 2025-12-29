UPDATE Pacientes
SET Email = CONCAT('paciente', ID_Paciente, '@test.com')
WHERE Email IS NULL;