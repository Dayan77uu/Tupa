-- =====================================================================================
-- MIGRACION 006: Correo institucional generado para talumno (Fase 1, Sprint 6)
--
-- CONTEXTO: autorizacion del docente (23/07/2026) para modificar bdtupa con criterio
-- del equipo y que el sistema funcione al 100%. El catalogo/datos de este sprint se
-- basan UNICAMENTE en el TUPA oficial enviado por el docente (Resolucion Rectoral
-- CU-520-2024-UNSAAC, 21/10/2024).
--
-- talumno tiene 4,522 alumnos reales, pero ninguno tiene correo @unsaac.edu.pe (son
-- todos Gmail/Hotmail personales - ver migracion 005). No se toca email (dato
-- personal real). Se agrega esta columna NUEVA, generada, unicamente para poder
-- autenticar en la plataforma.
-- =====================================================================================



ALTER TABLE talumno
  ADD COLUMN IF NOT EXISTS correo_institucional_generado VARCHAR(100) NULL
  -- GENERADO para el proyecto (autorizado por el docente 23/07/2026). No es el
  -- correo institucional oficial -- UNSAAC no expone ese dato en bdtupa.
  ;

UPDATE talumno
SET correo_institucional_generado = CONCAT(codigoalumno, '@unsaac.edu.pe');
