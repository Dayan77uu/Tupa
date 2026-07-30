-- =====================================================================================
-- MIGRACION 008: Registro de nuevo usuario con verificacion por correo (Sprint 6)
--
-- CONTEXTO: talumno esta vacia (migracion/borrado de la sesion anterior, sin fuente
-- real confirmada de datos de alumnos). Este flujo es la UNICA via real hoy para que
-- un estudiante cree una cuenta -- no reemplaza activar-cuenta.html (se mantiene el
-- codigo por si en el futuro aparece una fuente real de datos de talumno).
--
-- tusuario_pendiente guarda el registro mientras se verifica el correo; al verificar
-- el token se crea la fila real en tusuario/tlogin y se borra de aqui.
-- =====================================================================================

USE `bdtupa`;

CREATE TABLE IF NOT EXISTS `tusuario_pendiente` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(120) NOT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(200) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `token_expira` DATETIME NOT NULL,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_tusuario_pendiente_email` (`email`),
  UNIQUE KEY `uk_tusuario_pendiente_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
