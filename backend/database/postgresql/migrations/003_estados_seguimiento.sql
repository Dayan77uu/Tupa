-- =====================================================================================
-- MIGRACION 003: Seguimiento de Expediente (CU-04, RF07) y Notificaciones (RF08)
-- Sprint 3
--
-- MAPEO DE ESTADOS: el ENUM de texpediente.cestado solo tenia BORRADOR/RECIBIDO
-- (Sprint 2). RF07 exige 5 estados con color (Pendiente=gris, En revision=azul,
-- Observado=naranja, Aprobado=verde, Rechazado=rojo). Se mapea RECIBIDO -> PENDIENTE
-- porque significan lo mismo: el expediente ya fue recibido por la institucion y
-- esta pendiente de asignacion/revision (no hay diferencia de negocio entre ambos
-- terminos). BORRADOR se mantiene aparte: es un estado interno de Sprint 2 (checklist
-- todavia incompleto, el usuario ni siquiera confirmo el envio) que no es uno de los
-- 5 estados "visibles" de seguimiento de RF07 - un expediente en Borrador no deberia
-- ni aparecer en el dashboard de Mis Tramites todavia.
-- =====================================================================================



-- ---------------------------------------------------------------------------------------
-- 1. Ampliar el ENUM (paso intermedio: agregar los nuevos valores sin quitar RECIBIDO
--    todavia, para no perder filas existentes antes de migrarlas)
-- ---------------------------------------------------------------------------------------


-- ---------------------------------------------------------------------------------------
-- 2. Migrar datos existentes: RECIBIDO -> PENDIENTE
-- ---------------------------------------------------------------------------------------
UPDATE texpediente SET cestado = 'PENDIENTE' WHERE cestado = 'RECIBIDO';

-- ---------------------------------------------------------------------------------------
-- 3. Retirar RECIBIDO del ENUM (ya no se usa este valor de aqui en adelante)
-- ---------------------------------------------------------------------------------------


-- ---------------------------------------------------------------------------------------
-- 4. Historial de movimientos (RN-14: inmutable, sin UPDATE/DELETE desde la aplicacion)
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tmovimientoexpediente (
  id_movimiento SERIAL PRIMARY KEY,
  nro_expediente VARCHAR(20)  NOT NULL,
  estado_anterior VARCHAR(20) NULL,
  estado_nuevo VARCHAR(20) NOT NULL,
  comentario TEXT NULL,
  id_requisito_observado INT NULL,
  usuario_responsable VARCHAR(10)  NULL,
  fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_movimiento_expediente FOREIGN KEY (nro_expediente) REFERENCES texpediente (cnroexpediente),
  CONSTRAINT fk_movimiento_usuario FOREIGN KEY (usuario_responsable) REFERENCES tusuario (cidtusuario),
  CONSTRAINT fk_movimiento_requisito FOREIGN KEY (id_requisito_observado) REFERENCES trequisitotramite (nidtrequisitotramite)
);

-- ---------------------------------------------------------------------------------------
-- 5. Notificaciones (RF08). El envio real de correo depende de credenciales SMTP en
--    .env; si no existen, el backend deja constancia igual (modo simulado) - ver
--    app/notificaciones/service.py
-- ---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tnotificacion (
  id_notificacion SERIAL PRIMARY KEY,
  id_usuario VARCHAR(10)  NOT NULL,
  nro_expediente VARCHAR(20)  NOT NULL,
  mensaje VARCHAR(255) NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notificacion_usuario FOREIGN KEY (id_usuario) REFERENCES tusuario (cidtusuario),
  CONSTRAINT fk_notificacion_expediente FOREIGN KEY (nro_expediente) REFERENCES texpediente (cnroexpediente)
);
