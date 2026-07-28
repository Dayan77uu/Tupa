-- =====================================================================================
-- MIGRACION 002: Registro de Solicitud de Tramite (CU-03)
-- Sprint 2 - RF04, RF05, RF06, RF13, RN-08 a RN-11
--
-- DECISION DE DISENO (ver conversacion): tsolicitudtramite/tsolicitante ya tienen datos
-- reales de produccion (1850 / 5418 filas) con un ciclo de vida centrado en PAGO
-- (cestado: SOLICITADO/EN PROCESO/PAGADO/ANULADO/CERRADO/PAGADO SIN ADJUNTO) y una
-- identidad (tsolicitante) que NO esta garantizada para un tusuario autenticado (solo
-- 2 de 5 usuarios actuales tienen tsolicitante correspondiente). Por eso el flujo de
-- checklist de documentos de CU-03 usa tablas NUEVAS y propias, vinculadas directo a
-- tusuario (la misma identidad que ya autentica el login de Sprint 1), sin tocar ni
-- depender de las tablas legadas de pago.
-- =====================================================================================

USE `bdtupa`;

-- ---------------------------------------------------------------------------------------
-- 1. Contador atomico de expedientes por anio y tipo (RN-11: sin colisiones concurrentes)
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contador_expediente` (
  `anio` INT NOT NULL,
  `tipo` VARCHAR(10) NOT NULL,
  `ultimo_numero` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`anio`, `tipo`)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------------------
-- 2. Expediente (equivalente propio de "solicitud de tramite" para CU-03)
--    cnroexpediente formato ANIO-TIPO-SECUENCIAL, ej. 2026-PA-000123
--    TIPO se deriva en la aplicacion desde los 2 primeros caracteres de ccodigo
--    (PA/SE/PE...), con 'GEN' como respaldo cuando el codigo no tiene prefijo alfabetico
--    limpio (ver tcatalogotramite: hay codigos legados sin prefijo usable).
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `texpediente` (
  `nidtexpediente` INT AUTO_INCREMENT PRIMARY KEY,
  `cnroexpediente` VARCHAR(20) NOT NULL UNIQUE,
  `cidtusuario` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ccodigo` VARCHAR(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `cestado` ENUM('BORRADOR', 'RECIBIDO') NOT NULL DEFAULT 'BORRADOR',
  `dfecharegistro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dfechavencimiento` DATE NULL,
  `cnumerovoucher` VARCHAR(20) NULL,
  `nmontovoucher` DECIMAL(10, 2) NULL,
  `dfechapagovoucher` DATE NULL,
  `cestadovoucher` ENUM('PENDIENTE_VALIDACION', 'VALIDADO', 'RECHAZADO') NULL,
  CONSTRAINT `fk_expediente_usuario` FOREIGN KEY (`cidtusuario`) REFERENCES `tusuario` (`cidtusuario`),
  CONSTRAINT `fk_expediente_tramite` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------------------
-- 3. Documentos adjuntos por requisito del checklist (RF06, RN-10: formato y tamano)
--    Un documento por requisito y expediente; volver a subir reemplaza el anterior.
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tdocumentoexpediente` (
  `nidtdocumentoexpediente` INT AUTO_INCREMENT PRIMARY KEY,
  `nidtexpediente` INT NOT NULL,
  `nidtrequisitotramite` INT NOT NULL,
  `cnombrearchivooriginal` VARCHAR(255) NOT NULL,
  `crutaarchivo` VARCHAR(255) NOT NULL,
  `cformatoarchivo` VARCHAR(10) NOT NULL,
  `ntamaniobytes` INT NOT NULL,
  `dfechasubida` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_documento_expediente` FOREIGN KEY (`nidtexpediente`) REFERENCES `texpediente` (`nidtexpediente`),
  CONSTRAINT `fk_documento_requisito` FOREIGN KEY (`nidtrequisitotramite`) REFERENCES `trequisitotramite` (`nidtrequisitotramite`),
  UNIQUE KEY `uq_documento_expediente_requisito` (`nidtexpediente`, `nidtrequisitotramite`)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------------------
-- 4. Metadatos de checklist en trequisitotramite (no existian: obligatoriedad, formato,
--    tamano maximo). Se agregan con defaults razonables (RF06 exige PDF/JPG/PNG, 5 MB).
-- ---------------------------------------------------------------------------------------
ALTER TABLE `trequisitotramite`
  ADD COLUMN `bobligatorio` TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN `cformatospermitidos` VARCHAR(50) NOT NULL DEFAULT 'pdf,jpg,png',
  ADD COLUMN `nmaxtamaniomb` INT NOT NULL DEFAULT 5;

-- ---------------------------------------------------------------------------------------
-- 5. tferiado solo tenia sabados/domingos cargados (brecurrente=1), sin ningun feriado
--    nacional real. Se agregan Fiestas Patrias (28-29 julio) para poder probar RN de
--    calculo de plazo excluyendo feriados reales, no solo fines de semana.
-- ---------------------------------------------------------------------------------------
INSERT IGNORE INTO `tferiado` (`dfecha`, `cdescripcion`, `brecurrente`)
VALUES
  ('2026-07-28', 'DIA DE LA INDEPENDENCIA', 1),
  ('2026-07-29', 'FIESTAS PATRIAS', 1);
