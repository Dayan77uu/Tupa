-- =====================================================================================
-- MIGRACION 005: Dataset sintetico de desarrollo/demo (Fase 0.5, Sprint 5)
--
-- CONTEXTO (ver conversacion - Fase 0 de introspeccion real):
-- - tpersonal NO EXISTE en la BD real; el Plan de Proyecto asumia una tabla que
--   nunca se creo.
-- - talumno SI existe y son 4,522 alumnos reales, pero NINGUNO tiene correo
--   @unsaac.edu.pe (son todos Gmail/Hotmail personales) y 0 de los usuarios
--   actuales de tusuario coinciden con un alumno real por DNI ni por codigo.
-- - DECISION: no se toca ni se inserta nada en talumno (se consulta 100% read-only).
--   Se crea esta tabla propia del proyecto con datos claramente ficticios para
--   poder desarrollar y probar, hasta que el docente confirme el origen real de
--   bdtupa y se decida como integrar con datos reales de produccion.
--
-- Dataset sintetico para desarrollo/demo. NO representa personas reales de la
-- UNSAAC. Pendiente de confirmacion del docente sobre el origen de bdtupa antes
-- de integrar con datos reales de produccion. Ver app/perfil_service.py::
-- obtener_perfil_por_dni() para el mecanismo de fallback (talumno real primero,
-- tperfildemo despues) que permitira el cambio a datos reales sin tocar codigo,
-- una vez confirmado.
-- =====================================================================================



CREATE TABLE IF NOT EXISTS tperfildemo (
  dni VARCHAR(10) PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  carrera VARCHAR(150) NULL,
  correo VARCHAR(100) NOT NULL
);

-- DNIs 00000001-00000005: rango claramente ficticio, fuera de cualquier DNI real
-- de 8 digitos, para que nunca coincida por accidente con talumno.
INSERT INTO tperfildemo (dni, nombres, apellidos, carrera, correo)
VALUES
  ('00000001', 'Estudiante Demo', 'Uno', 'Ingenieria Informatica y de Sistemas', 'demo.uno@unsaac.edu.pe'),
  ('00000002', 'Estudiante Demo', 'Dos', 'Ingenieria Civil', 'demo.dos@unsaac.edu.pe'),
  ('00000003', 'Estudiante Demo', 'Tres', 'Derecho', 'demo.tres@unsaac.edu.pe'),
  ('00000004', 'Estudiante Demo', 'Cuatro', 'Medicina Humana', 'demo.cuatro@unsaac.edu.pe'),
  ('00000005', 'Estudiante Demo', 'Cinco', 'Contabilidad', 'demo.cinco@unsaac.edu.pe') ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------------------
-- Historial de versiones del catalogo (CU-09, RF14, RN-27/RN-29). Inmutable: sin
-- endpoints de edicion/borrado.
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS thistorialcatalogo (
  id_historial SERIAL PRIMARY KEY,
  ccodigo VARCHAR(20)  NOT NULL,
  campo_modificado VARCHAR(50) NOT NULL,
  valor_anterior TEXT NULL,
  valor_nuevo TEXT NULL,
  usuario VARCHAR(10)  NULL,
  numero_resolucion VARCHAR(50) NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_historial_tramite FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo),
  CONSTRAINT fk_historial_usuario FOREIGN KEY (usuario) REFERENCES tusuario (cidtusuario)
);
