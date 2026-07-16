-- =====================================================================================
-- MIGRACION 001: Bloqueo de cuentas por intentos fallidos, auditoria de login,
--                y estado/plazo del catalogo TUPA.
-- Sprint 1 - CU-01 (Autenticar Usuario), CU-10 (Validar Datos de Usuario), CU-02 (Catalogo)
--
-- NOTA IMPORTANTE: el esquema real de bdtupa NO coincide con el asumido inicialmente.
-- No existe una tabla "usuarios" unica: la identidad esta en `tusuario`, la credencial
-- (usuario/hash/vigencia) y el rol (nidtperfil) estan en `tlogin`. Por eso los campos de
-- bloqueo se agregan a `tlogin`, que es donde vive el intento de autenticacion.
-- =====================================================================================

USE `bdtupa`;

-- ---------------------------------------------------------------------------------------
-- 1. Bloqueo de cuentas tras intentos fallidos (RN-02/RN-03) -> en tlogin, no en tusuario
-- ---------------------------------------------------------------------------------------
ALTER TABLE `tlogin`
  ADD COLUMN `intentos_fallidos` INT NOT NULL DEFAULT 0,
  ADD COLUMN `fecha_bloqueo` DATETIME NULL;

-- ---------------------------------------------------------------------------------------
-- 2. Auditoria de intentos de login (RN-04)
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `registro_auditoria` (
  `id_registro` INT AUTO_INCREMENT PRIMARY KEY,
  `correo_ingresado` VARCHAR(120) NULL,
  `direccion_ip` VARCHAR(45) NOT NULL,
  `resultado` ENUM('EXITOSO', 'FALLIDO', 'ERROR_SISTEMA') NOT NULL,
  `fecha_hora` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------------------
-- 3. Estado y plazo del catalogo TUPA (CU-02 / RF02-RF03)
-- No existian columnas para filtrar tramites activos ni un plazo numerico en dias;
-- el plazo real vive como texto libre en tdetalletramite ("PLAZO DE ATENCION") y solo
-- esta cargado para 1 de 63 tramites, por lo que se deja NULL por defecto.
-- ---------------------------------------------------------------------------------------
ALTER TABLE `tcatalogotramite`
  ADD COLUMN `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  ADD COLUMN `nplazodias` INT NULL;
