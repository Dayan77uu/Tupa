-- =====================================================================================
-- MIGRACION 004: Bandeja de expedientes (CU-06, RF10) y derivacion entre oficinas (CU-07)
-- Sprint 4
--
-- HALLAZGOS REALES (ver conversacion): solo 4 de 63 tramites activos tienen oficina
-- responsable en tunidadtramite. No existe ningun vinculo usuario<->oficina en la BD
-- (ni tusuario ni tlogin tienen columna de oficina). No existe el rol "Personal
-- Administrativo" literal (los roles no-estudiante reales son USUARIO DE RECAUDACION,
-- COORDINADOR DE TESORERIA, OPERADOR DE OTI, ADMINISTRADOR). tunidadorganizativa solo
-- tiene 2 filas (sedes, no departamentos como "Tesoreria" o "Secretaria General").
--
-- DECISIONES APLICADAS (no bloqueantes, documentadas):
-- - "Personal Administrativo" = cualquier rol != ESTUDIANTE (ver
--   app/auth/decorators.py::requiere_rol_administrativo).
-- - Oficina inicial de cada expediente: la oficina responsable real via tunidadtramite
--   cuando existe; si el tramite no tiene ninguna (59 de 63 casos), se usa SEDE CENTRAL
--   CUSCO (id 1) como valor por defecto - no se inventa una oficina nueva.
-- - tflujoderivacion se crea VACIA. Se agrega UNA fila explicitamente marcada como dato
--   de PRUEBA (no institucional real) para poder ejercitar CU-07 en Fase F. Se necesitan
--   datos reales del flujo del TUPA antes de usar esto en produccion.
-- =====================================================================================

USE `bdtupa`;

-- ---------------------------------------------------------------------------------------
-- 1. Oficina actual del expediente (para la bandeja, RF10)
-- ---------------------------------------------------------------------------------------
ALTER TABLE `texpediente`
  ADD COLUMN `nidtoficinaactual` INT NULL AFTER `ccodigo`,
  ADD CONSTRAINT `fk_expediente_oficina` FOREIGN KEY (`nidtoficinaactual`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`);

-- Oficina responsable real cuando existe (toma la primera si hay mas de una)
UPDATE `texpediente` e
JOIN (
  SELECT ccodigo, MIN(nidtunidadorganizativa) AS oficina
  FROM `tunidadtramite`
  GROUP BY ccodigo
) ut ON ut.ccodigo = e.ccodigo
SET e.nidtoficinaactual = ut.oficina
WHERE e.nidtoficinaactual IS NULL;

-- Respaldo: SEDE CENTRAL CUSCO (id 1) para tramites sin oficina real asignada
UPDATE `texpediente` SET `nidtoficinaactual` = 1 WHERE `nidtoficinaactual` IS NULL;

ALTER TABLE `texpediente` MODIFY COLUMN `nidtoficinaactual` INT NOT NULL;

-- ---------------------------------------------------------------------------------------
-- 2. Motivo de rechazo del voucher (faltaba, RF13/HU-12)
-- ---------------------------------------------------------------------------------------
ALTER TABLE `texpediente`
  ADD COLUMN `cmotivorechazovoucher` VARCHAR(255) NULL;

-- ---------------------------------------------------------------------------------------
-- 3. Oficina asignada a cada login administrativo (no existia ningun vinculo)
-- ---------------------------------------------------------------------------------------
ALTER TABLE `tlogin`
  ADD COLUMN `nidtunidadorganizativa` INT NULL,
  ADD CONSTRAINT `fk_login_oficina` FOREIGN KEY (`nidtunidadorganizativa`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`);

-- Usuarios de prueba existentes (no-estudiante) -> SEDE CENTRAL CUSCO.
-- No hay dato real de a que oficina pertenece cada uno; es una asignacion de prueba.
UPDATE `tlogin` SET `nidtunidadorganizativa` = 1
WHERE `cidtusuario` IN ('24007146', '44760467', 'OTI_TESO');

-- ---------------------------------------------------------------------------------------
-- 4. Flujo de derivacion valido por tramite (CU-07, RN-22). Tabla vacia por diseno:
--    no existe ninguna fuente real de este flujo en la BD. La unica fila que se inserta
--    esta marcada explicitamente como dato de PRUEBA para poder ejercitar la Fase F.
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tflujoderivacion` (
  `id_flujo` INT AUTO_INCREMENT PRIMARY KEY,
  `ccodigo` VARCHAR(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `oficina_origen` INT NOT NULL,
  `oficina_destino` INT NOT NULL,
  CONSTRAINT `fk_flujo_tramite` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`),
  CONSTRAINT `fk_flujo_origen` FOREIGN KEY (`oficina_origen`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `fk_flujo_destino` FOREIGN KEY (`oficina_destino`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`)
) ENGINE=InnoDB;

-- DATO DE PRUEBA (no institucional real) - PA88401484E es el tramite que ya usamos para
-- probar Sprint 2/3. Permite derivar de SEDE CENTRAL CUSCO a SEDE DESCONCENTRADA DE
-- CHECACUPE para poder probar CU-07 en Fase F. Reemplazar por datos reales del flujo
-- del TUPA antes de usar en produccion.
INSERT INTO `tflujoderivacion` (`ccodigo`, `oficina_origen`, `oficina_destino`)
VALUES ('PA88401484E', 1, 2);

-- ---------------------------------------------------------------------------------------
-- 5. Trazabilidad de oficina en el historial de movimientos (RN-23: la derivacion
--    registra oficina origen y destino, ademas del cambio de estado si lo hubiera)
-- ---------------------------------------------------------------------------------------
ALTER TABLE `tmovimientoexpediente`
  ADD COLUMN `oficina_anterior` INT NULL,
  ADD COLUMN `oficina_nueva` INT NULL,
  ADD CONSTRAINT `fk_movimiento_oficina_anterior` FOREIGN KEY (`oficina_anterior`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`),
  ADD CONSTRAINT `fk_movimiento_oficina_nueva` FOREIGN KEY (`oficina_nueva`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`);
