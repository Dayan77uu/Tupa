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



-- ---------------------------------------------------------------------------------------
-- 1. Contador atomico de expedientes por anio y tipo (RN-11: sin colisiones concurrentes)
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contador_expediente (
  anio INT NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  ultimo_numero INT NOT NULL DEFAULT 0,
  PRIMARY KEY (anio, tipo)
);

-- ---------------------------------------------------------------------------------------
-- 2. Expediente (equivalente propio de "solicitud de tramite" para CU-03)
--    cnroexpediente formato ANIO-TIPO-SECUENCIAL, ej. 2026-PA-000123
--    TIPO se deriva en la aplicacion desde los 2 primeros caracteres de ccodigo
--    (PA/SE/PE...), con 'GEN' como respaldo cuando el codigo no tiene prefijo alfabetico
--    limpio (ver tcatalogotramite: hay codigos legados sin prefijo usable).
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS texpediente (
  nidtexpediente SERIAL PRIMARY KEY,
  cnroexpediente VARCHAR(20) NOT NULL UNIQUE,
  cidtusuario VARCHAR(10)  NOT NULL,
  ccodigo VARCHAR(20)  NOT NULL,
  cestado ENUM('BORRADOR', 'RECIBIDO') NOT NULL DEFAULT 'BORRADOR',
  dfecharegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dfechavencimiento DATE NULL,
  cnumerovoucher VARCHAR(20) NULL,
  nmontovoucher DECIMAL(10, 2) NULL,
  dfechapagovoucher DATE NULL,
  cestadovoucher ENUM('PENDIENTE_VALIDACION', 'VALIDADO', 'RECHAZADO') NULL,
  CONSTRAINT fk_expediente_usuario FOREIGN KEY (cidtusuario) REFERENCES tusuario (cidtusuario),
  CONSTRAINT fk_expediente_tramite FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo)
);

-- ---------------------------------------------------------------------------------------
-- 3. Documentos adjuntos por requisito del checklist (RF06, RN-10: formato y tamano)
--    Un documento por requisito y expediente; volver a subir reemplaza el anterior.
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tdocumentoexpediente (
  nidtdocumentoexpediente SERIAL PRIMARY KEY,
  nidtexpediente INT NOT NULL,
  nidtrequisitotramite INT NOT NULL,
  cnombrearchivooriginal VARCHAR(255) NOT NULL,
  crutaarchivo VARCHAR(255) NOT NULL,
  cformatoarchivo VARCHAR(10) NOT NULL,
  ntamaniobytes INT NOT NULL,
  dfechasubida TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_documento_expediente FOREIGN KEY (nidtexpediente) REFERENCES texpediente (nidtexpediente),
  CONSTRAINT fk_documento_requisito FOREIGN KEY (nidtrequisitotramite) REFERENCES trequisitotramite (nidtrequisitotramite),
  UNIQUE (nidtexpediente, nidtrequisitotramite)
);

-- ---------------------------------------------------------------------------------------
-- 4. Metadatos de checklist en trequisitotramite (no existian: obligatoriedad, formato,
--    tamano maximo). Se agregan con defaults razonables (RF06 exige PDF/JPG/PNG, 5 MB).
-- ---------------------------------------------------------------------------------------
ALTER TABLE trequisitotramite
  ADD COLUMN IF NOT EXISTS bobligatorio BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS cformatospermitidos VARCHAR(50) NOT NULL DEFAULT 'pdf,jpg,png',
  ADD COLUMN IF NOT EXISTS nmaxtamaniomb INT NOT NULL DEFAULT 5;

-- ---------------------------------------------------------------------------------------
-- 5. tferiado solo tenia sabados/domingos cargados (brecurrente=1), sin ningun feriado
--    nacional real. Se agregan Fiestas Patrias (28-29 julio) para poder probar RN de
--    calculo de plazo excluyendo feriados reales, no solo fines de semana.
-- ---------------------------------------------------------------------------------------
INSERT INTO tferiado (dfecha, cdescripcion, brecurrente)
VALUES
  ('2026-07-28', 'DIA DE LA INDEPENDENCIA', TRUE),
  ('2026-07-29', 'FIESTAS PATRIAS', TRUE) ON CONFLICT DO NOTHING;
