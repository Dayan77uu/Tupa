-- =====================================================================================
-- MIGRACION 007: Activacion de cuenta real (Sprint 6 - correccion de seguridad)
--
-- CONTEXTO: la Fase 1 de la migracion/carga anterior creo 2,306 cuentas reales de
-- alumnos (tusuario+tlogin) con una contrasena COMPARTIDA en texto plano, escrita
-- como constante en un script que se pusheo a un repositorio publico. Se corrige
-- invalidando esas contrasenas (hash de un secreto aleatorio descartado, que nadie
-- conoce) y agregando un flujo de activacion propio (POST /api/auth/activar-cuenta)
-- para que cada alumno real establezca su propia contrasena verificando
-- codigoalumno + DNI contra talumno.
--
-- activada = FALSE significa "el login existe pero su hash actual es un secreto
-- aleatorio descartado -- nadie puede entrar hasta que la cuenta pase por
-- activar-cuenta". Todas las cuentas YA existentes (admin/demo de sprints previos)
-- quedan activada = TRUE por defecto: no se ven afectadas.
-- =====================================================================================



ALTER TABLE tlogin
  ADD COLUMN IF NOT EXISTS activada BOOLEAN NOT NULL DEFAULT TRUE
  ;
