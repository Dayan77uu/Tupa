
CREATE TABLE contador_expediente (
  anio int NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  ultimo_numero int NOT NULL DEFAULT '0',
  PRIMARY KEY (anio,tipo)
);


CREATE TABLE registro_auditoria (
  id_registro SERIAL,
  correo_ingresado VARCHAR(120) DEFAULT NULL,
  direccion_ip VARCHAR(45) NOT NULL,
  resultado VARCHAR(255) NOT NULL,
  fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_registro)
);


CREATE TABLE tagrupadormodulo (
  nidtagrupadormodulo SERIAL,
  cdescripcionagrupador VARCHAR(50)  DEFAULT NULL,
  ciconoagrupador VARCHAR(45)  DEFAULT NULL,
  PRIMARY KEY (nidtagrupadormodulo)
);


CREATE TABLE talumno (
  codigoalumno VARCHAR(8)  NOT NULL DEFAULT '',
  apalumno VARCHAR(50)  DEFAULT NULL,
  amalumno VARCHAR(50)  DEFAULT NULL,
  nombresalumno VARCHAR(50)  DEFAULT NULL,
  dni VARCHAR(10)  NOT NULL,
  usuario VARCHAR(10)  DEFAULT NULL,
  password VARCHAR(10)  DEFAULT NULL,
  activo VARCHAR(2)  DEFAULT 'SI',
  ultimoacceso VARCHAR(25)  DEFAULT NULL,
  observacion_al VARCHAR(50)  DEFAULT NULL,
  sexoalumno VARCHAR(1)  DEFAULT NULL,
  fechanac VARCHAR(10)  DEFAULT NULL,
  direccion VARCHAR(100)  DEFAULT NULL,
  telefono VARCHAR(9)  DEFAULT NULL,
  email VARCHAR(100)  DEFAULT NULL,
  foto VARCHAR(100)  DEFAULT NULL,
  curricula VARCHAR(4)  DEFAULT NULL,
  codigoespecialidad VARCHAR(3)  DEFAULT NULL,
  codigosede VARCHAR(3)  DEFAULT NULL,
  correo_institucional_generado VARCHAR(100)  DEFAULT NULL ,
  PRIMARY KEY (codigoalumno)
);


CREATE TABLE talumnocalca (
  codigoalumno VARCHAR(8)  NOT NULL DEFAULT '',
  apalumno VARCHAR(50)  DEFAULT NULL,
  amalumno VARCHAR(50)  DEFAULT NULL,
  nombresalumno VARCHAR(50)  DEFAULT NULL,
  dni VARCHAR(8)  NOT NULL,
  usuario VARCHAR(10)  DEFAULT NULL,
  password VARCHAR(8)  DEFAULT NULL,
  activo VARCHAR(2)  DEFAULT NULL,
  ultimoacceso VARCHAR(25)  DEFAULT NULL,
  observacion_al VARCHAR(50)  DEFAULT NULL,
  sexoalumno VARCHAR(1)  DEFAULT NULL,
  fechanac VARCHAR(10)  DEFAULT NULL,
  direccion VARCHAR(100)  DEFAULT NULL,
  telefono VARCHAR(9)  DEFAULT NULL,
  email VARCHAR(100)  DEFAULT NULL,
  foto VARCHAR(100)  DEFAULT NULL,
  curricula VARCHAR(4)  DEFAULT NULL,
  codigoespecialidad VARCHAR(3)  DEFAULT NULL,
  codigosede VARCHAR(3)  DEFAULT NULL
);


CREATE TABLE talumnochecacupe (
  codigoalumno VARCHAR(8)  NOT NULL DEFAULT '',
  apalumno VARCHAR(50)  DEFAULT NULL,
  amalumno VARCHAR(50)  DEFAULT NULL,
  nombresalumno VARCHAR(50)  DEFAULT NULL,
  dni VARCHAR(8)  NOT NULL,
  usuario VARCHAR(10)  DEFAULT NULL,
  password VARCHAR(8)  DEFAULT NULL,
  activo VARCHAR(2)  DEFAULT NULL,
  ultimoacceso VARCHAR(25)  DEFAULT NULL,
  observacion_al VARCHAR(50)  DEFAULT NULL,
  sexoalumno VARCHAR(1)  DEFAULT NULL,
  fechanac VARCHAR(10)  DEFAULT NULL,
  direccion VARCHAR(100)  DEFAULT NULL,
  telefono VARCHAR(9)  DEFAULT NULL,
  email VARCHAR(100)  DEFAULT NULL,
  foto VARCHAR(100)  DEFAULT NULL,
  curricula VARCHAR(4)  DEFAULT NULL,
  codigoespecialidad VARCHAR(3)  DEFAULT NULL,
  codigosede VARCHAR(3)  DEFAULT NULL
);


CREATE TABLE talumnocusco (
  codigoalumno VARCHAR(8)  NOT NULL DEFAULT '',
  apalumno VARCHAR(50)  DEFAULT NULL,
  amalumno VARCHAR(50)  DEFAULT NULL,
  nombresalumno VARCHAR(50)  DEFAULT NULL,
  dni VARCHAR(10)  NOT NULL,
  usuario VARCHAR(10)  DEFAULT NULL,
  password VARCHAR(10)  DEFAULT NULL,
  activo VARCHAR(2)  DEFAULT 'SI',
  ultimoacceso VARCHAR(25)  DEFAULT NULL,
  observacion_al VARCHAR(50)  DEFAULT NULL,
  sexoalumno VARCHAR(1)  DEFAULT NULL,
  fechanac VARCHAR(10)  DEFAULT NULL,
  direccion VARCHAR(100)  DEFAULT NULL,
  telefono VARCHAR(9)  DEFAULT NULL,
  email VARCHAR(100)  DEFAULT NULL,
  foto VARCHAR(100)  DEFAULT NULL,
  curricula VARCHAR(4)  DEFAULT NULL,
  codigoespecialidad VARCHAR(3)  DEFAULT NULL,
  codigosede VARCHAR(3)  DEFAULT NULL
);


CREATE TABLE tcatalogotramite (
  ccodigo VARCHAR(20) NOT NULL,
  cdenominaciontramite VARCHAR(200)  DEFAULT NULL,
  cdescripcion VARCHAR(1000)  DEFAULT NULL,
  ccodigobanco VARCHAR(10) DEFAULT NULL,
  btienemontofijo BOOLEAN DEFAULT NULL,
  estado VARCHAR(255) NOT NULL DEFAULT 'ACTIVO',
  nplazodias int DEFAULT NULL,
  PRIMARY KEY (ccodigo)
);


CREATE TABLE tcomisionbanco (
  nidtcomisionbanco SERIAL,
  dfechainicio TIMESTAMP DEFAULT NULL,
  dfechafin TIMESTAMP DEFAULT NULL,
  nmonto decimal(10,2) DEFAULT NULL,
  ccodigoespecifica VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (nidtcomisionbanco)
);


CREATE TABLE tcomisionbancoaplicacion (
  nidtcomisionbancoaplicacion SERIAL,
  nidtsolicitudtramite bigint DEFAULT NULL,
  nidtcomisionbanco int DEFAULT NULL,
  cdescripcion text,
  nmontocomision decimal(10,2) DEFAULT NULL,
  ccodigoespecifica VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (nidtcomisionbancoaplicacion)
);


CREATE TABLE tcomprobantepago (
  cnumerocomprobante VARCHAR(10) NOT NULL,
  nidtserieunidadtramite int DEFAULT NULL,
  cserie VARCHAR(6) NOT NULL,
  nidtdependenciapago int DEFAULT NULL,
  cidtusuario VARCHAR(10) DEFAULT NULL,
  dfechaemision TIMESTAMP DEFAULT NULL,
  cusuarioregistro VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (cnumerocomprobante,cserie)
);


CREATE TABLE tconfiguracion (
  nidtconfiguracion SERIAL,
  cdescripcion VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (nidtconfiguracion)
);


CREATE TABLE tdetallecomprobantepago (
  cnumerocomprobante VARCHAR(10) NOT NULL,
  cserie VARCHAR(6) NOT NULL,
  ccodigo VARCHAR(20) DEFAULT NULL,
  cdescripcionpago VARCHAR(100) DEFAULT NULL,
  ncantidad int DEFAULT NULL,
  PRIMARY KEY (cnumerocomprobante,cserie)
);


CREATE TABLE tdetalleconfiguracion (
  nidtdetalleconfiguracion SERIAL,
  nidtconfiguracion int DEFAULT NULL,
  cdescripciondetalleconfiguracion VARCHAR(200) DEFAULT NULL,
  PRIMARY KEY (nidtdetalleconfiguracion)
);


CREATE TABLE tdetalletramite (
  nidtdetalletramite SERIAL,
  ccodigo VARCHAR(20) DEFAULT NULL,
  cdenominaciondetalle VARCHAR(300) DEFAULT NULL,
  cvalordetalle VARCHAR(300) DEFAULT NULL,
  PRIMARY KEY (nidtdetalletramite)
);


CREATE TABLE tdocumentoexpediente (
  nidtdocumentoexpediente SERIAL,
  nidtexpediente int NOT NULL,
  nidtrequisitotramite int NOT NULL,
  cnombrearchivooriginal VARCHAR(255) NOT NULL,
  crutaarchivo VARCHAR(255) NOT NULL,
  cformatoarchivo VARCHAR(10) NOT NULL,
  ntamaniobytes int NOT NULL,
  dfechasubida TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (nidtdocumentoexpediente),
  UNIQUE (nidtexpediente,nidtrequisitotramite)
);


CREATE TABLE tespecialidad (
  ccodigoespecialidad VARCHAR(3)  NOT NULL,
  cnombreespecialidad VARCHAR(100)  NOT NULL,
  PRIMARY KEY (ccodigoespecialidad)
);


CREATE TABLE tespecifica (
  ccodigoespecifica VARCHAR(20) NOT NULL,
  nidttipoespecifica int NOT NULL,
  nidtiporeciboingreso int DEFAULT NULL,
  ctipoespecifica VARCHAR(50) DEFAULT NULL,
  cdescripcionespecifica VARCHAR(200) DEFAULT NULL,
  PRIMARY KEY (ccodigoespecifica)
);


CREATE TABLE tespecificatramite (
  ccodigoespecifica VARCHAR(20) NOT NULL,
  ccodigo VARCHAR(20) NOT NULL,
  dfechainicio TIMESTAMP DEFAULT NULL,
  dfechafin TIMESTAMP DEFAULT NULL,
  bvigente bit(1) DEFAULT NULL,
  PRIMARY KEY (ccodigoespecifica,ccodigo)
);


CREATE TABLE texpediente (
  nidtexpediente SERIAL,
  cnroexpediente VARCHAR(20) NOT NULL,
  cidtusuario VARCHAR(10)  NOT NULL,
  ccodigo VARCHAR(20)  NOT NULL,
  nidtoficinaactual int NOT NULL,
  cestado VARCHAR(255) NOT NULL DEFAULT 'BORRADOR',
  dfecharegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dfechavencimiento date DEFAULT NULL,
  cnumerovoucher VARCHAR(20) DEFAULT NULL,
  nmontovoucher decimal(10,2) DEFAULT NULL,
  dfechapagovoucher date DEFAULT NULL,
  cestadovoucher VARCHAR(255) DEFAULT NULL,
  cmotivorechazovoucher VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (nidtexpediente),
  UNIQUE (cnroexpediente)
);


CREATE TABLE tferiado (
  nidtferidado SERIAL,
  dfecha date NOT NULL,
  cdescripcion VARCHAR(100) DEFAULT NULL,
  brecurrente BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (nidtferidado),
  UNIQUE (dfecha)
);


CREATE TABLE tflujoderivacion (
  id_flujo SERIAL,
  ccodigo VARCHAR(20)  NOT NULL,
  oficina_origen int NOT NULL,
  oficina_destino int NOT NULL,
  PRIMARY KEY (id_flujo)
);


CREATE TABLE thistorialcatalogo (
  id_historial SERIAL,
  ccodigo VARCHAR(20)  NOT NULL,
  campo_modificado VARCHAR(50) NOT NULL,
  valor_anterior text,
  valor_nuevo text,
  usuario VARCHAR(10)  DEFAULT NULL,
  numero_resolucion VARCHAR(50) NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_historial)
);


CREATE TABLE tlogin (
  clogin VARCHAR(20)  NOT NULL,
  cidtusuario VARCHAR(10)  NOT NULL,
  nidtperfil int NOT NULL,
  dfechainicio TIMESTAMP DEFAULT NULL,
  dfechafin TIMESTAMP DEFAULT NULL,
  ccontrasenia VARCHAR(200)  DEFAULT NULL,
  intentos_fallidos int NOT NULL DEFAULT '0',
  fecha_bloqueo TIMESTAMP DEFAULT NULL,
  nidtunidadorganizativa int DEFAULT NULL,
  activada BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (clogin)
);


CREATE TABLE tmenuperfil (
  nidtmenuperfil SERIAL,
  nidtmodulo int NOT NULL,
  nidtperfil int NOT NULL,
  PRIMARY KEY (nidtmenuperfil)
);


CREATE TABLE tmodulo (
  nidtmodulo SERIAL,
  nidtagrupadormodulo int NOT NULL,
  cdescripcionmodulo VARCHAR(250)  DEFAULT NULL,
  ciconomodulo VARCHAR(45)  DEFAULT NULL,
  crutamodulo VARCHAR(200) DEFAULT NULL,
  PRIMARY KEY (nidtmodulo)
);


CREATE TABLE tmontotramite (
  nidtmontotramite SERIAL,
  ccodigo VARCHAR(20) NOT NULL,
  nmonto decimal(10,2) DEFAULT NULL,
  cdescripcionpago VARCHAR(300)  DEFAULT NULL,
  dfechainicio TIMESTAMP DEFAULT NULL,
  dfechafin TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (nidtmontotramite)
);


CREATE TABLE tmovimientoexpediente (
  id_movimiento SERIAL,
  nro_expediente VARCHAR(20)  NOT NULL,
  estado_anterior VARCHAR(20) DEFAULT NULL,
  estado_nuevo VARCHAR(20) NOT NULL,
  comentario text,
  id_requisito_observado int DEFAULT NULL,
  usuario_responsable VARCHAR(10)  DEFAULT NULL,
  fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  oficina_anterior int DEFAULT NULL,
  oficina_nueva int DEFAULT NULL,
  PRIMARY KEY (id_movimiento)
);


CREATE TABLE tnotificacion (
  id_notificacion SERIAL,
  id_usuario VARCHAR(10)  NOT NULL,
  nro_expediente VARCHAR(20)  NOT NULL,
  mensaje VARCHAR(255) NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_notificacion)
);


CREATE TABLE tperfil (
  nidtperfil SERIAL,
  cdescripcionperfil VARCHAR(100)  DEFAULT NULL,
  PRIMARY KEY (nidtperfil)
);


CREATE TABLE tperfildemo (
  dni VARCHAR(10) NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  carrera VARCHAR(150) DEFAULT NULL,
  correo VARCHAR(100) NOT NULL,
  PRIMARY KEY (dni)
);


CREATE TABLE treciboingreso (
  nidtreciboingreso SERIAL,
  nnrorecibo int DEFAULT NULL,
  nanio int DEFAULT NULL,
  nidtiporeciboingreso int DEFAULT NULL,
  clogin VARCHAR(20)  DEFAULT NULL,
  dfecharecibo TIMESTAMP DEFAULT NULL,
  cnumerosiaf VARCHAR(6)  DEFAULT NULL,
  dfecharegistro TIMESTAMP DEFAULT NULL,
  cobservacion VARCHAR(500)  DEFAULT NULL,
  cnotapago VARCHAR(30)  DEFAULT NULL,
  cexpedientesiaf VARCHAR(30)  DEFAULT NULL,
  cordenservicio VARCHAR(30)  DEFAULT NULL,
  cruc VARCHAR(30)  DEFAULT NULL,
  cproveedor VARCHAR(100)  DEFAULT NULL,
  cfactura VARCHAR(40)  DEFAULT NULL,
  cguiaremision VARCHAR(40)  DEFAULT NULL,
  crubro VARCHAR(40)  DEFAULT NULL,
  ccorrelativocut VARCHAR(40)  DEFAULT NULL,
  ctiporubro VARCHAR(40)  DEFAULT NULL,
  PRIMARY KEY (nidtreciboingreso)
);


CREATE TABLE treciboingresodetalle (
  nidtreciboingresodetalle SERIAL,
  nidtreciboingreso int DEFAULT NULL,
  nidtsolicitudtramitedetalle int DEFAULT NULL,
  ccodigoespecifica VARCHAR(20)  DEFAULT NULL,
  ccodigo VARCHAR(20)  DEFAULT NULL,
  nmontotramite decimal(10,2) DEFAULT NULL,
  ctransaccion VARCHAR(50)  DEFAULT NULL,
  PRIMARY KEY (nidtreciboingresodetalle)
);


CREATE TABLE trequisitotramite (
  nidtrequisitotramite SERIAL,
  ccodigo VARCHAR(20) NOT NULL,
  cdescripcionrequisito VARCHAR(400)  DEFAULT NULL,
  bobligatorio BOOLEAN NOT NULL DEFAULT TRUE,
  cformatospermitidos VARCHAR(50) NOT NULL DEFAULT 'pdf,jpg,png',
  nmaxtamaniomb int NOT NULL DEFAULT '5',
  PRIMARY KEY (nidtrequisitotramite)
);


CREATE TABLE tserieunidadtramite (
  nidtserieunidadtramite SERIAL,
  cserie VARCHAR(6) DEFAULT NULL,
  nidtunidadorganizativa int DEFAULT NULL,
  bvigente bit(1) DEFAULT NULL,
  PRIMARY KEY (nidtserieunidadtramite)
);


CREATE TABLE tsolicitante (
  ccodigosolicitante VARCHAR(11)  NOT NULL,
  cnumerodocumento VARCHAR(11)  DEFAULT NULL,
  cnombres VARCHAR(30)  DEFAULT NULL,
  capellidopaterno VARCHAR(30)  DEFAULT NULL,
  capellidomaterno VARCHAR(30)  DEFAULT NULL,
  PRIMARY KEY (ccodigosolicitante)
);


CREATE TABLE tsolicitanteespecialidad (
  ccodigosolicitante VARCHAR(11)  NOT NULL,
  cnumerodocumento VARCHAR(10)  NOT NULL,
  ccodigoespecialidad VARCHAR(3)  NOT NULL,
  cnombreespecialidad VARCHAR(100)  NOT NULL,
  PRIMARY KEY (ccodigosolicitante,ccodigoespecialidad)
);


CREATE TABLE tsolicitudtramite (
  nidtsolicitudtramite bigSERIAL,
  ccodigosolicitante VARCHAR(11)  NOT NULL,
  nidttiposolicitante int NOT NULL,
  dfechapeticion TIMESTAMP NOT NULL,
  dfecharegistro TIMESTAMP NOT NULL,
  ccomprobantepath VARCHAR(255)  DEFAULT NULL,
  cnumerotransaccion VARCHAR(10)  DEFAULT NULL,
  dfechatransaccion TIMESTAMP DEFAULT NULL,
  dhoratransaccion TIMESTAMP DEFAULT NULL,
  cestado VARCHAR(255)  NOT NULL DEFAULT 'SOLICITADO',
  cidtsolicitudtramite VARCHAR(10)  DEFAULT NULL,
  nnumerotramite int DEFAULT NULL,
  dfechainiciovigencia TIMESTAMP DEFAULT NULL,
  dfechafinvigencia TIMESTAMP DEFAULT NULL,
  dfechasubidoarchivo TIMESTAMP DEFAULT NULL,
  dfechapago TIMESTAMP DEFAULT NULL,
  cnumerorecibocaja VARCHAR(20)  DEFAULT NULL,
  PRIMARY KEY (nidtsolicitudtramite)
);


CREATE TABLE tsolicitudtramitedetalle (
  nidtsolicitudtramitedetalle SERIAL,
  nidtsolicitudtramite bigint NOT NULL,
  ccodigo VARCHAR(20) DEFAULT NULL,
  nidtmontotramite int DEFAULT NULL,
  ncantidad int DEFAULT NULL,
  cdescripcion text,
  nmontotramite decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (nidtsolicitudtramitedetalle)
);


CREATE TABLE ttiporeciboingreso (
  nidtiporeciboingreso SERIAL,
  cdescripcion VARCHAR(250) DEFAULT NULL,
  cfuentefinanciamiento VARCHAR(50) DEFAULT NULL,
  crubro VARCHAR(300) DEFAULT NULL,
  ctiporecurso VARCHAR(300) DEFAULT NULL,
  ctipooperacion VARCHAR(200) DEFAULT NULL,
  ccuentabanco VARCHAR(40) DEFAULT NULL,
  PRIMARY KEY (nidtiporeciboingreso)
);


CREATE TABLE ttoken (
  cidtsesion VARCHAR(20) NOT NULL,
  cusuario VARCHAR(20) DEFAULT NULL,
  ctoken VARCHAR(200) DEFAULT NULL,
  cestado VARCHAR(200) DEFAULT NULL,
  dfechatoken TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (cidtsesion)
);


CREATE TABLE tunidadorganizativa (
  nidtunidadorganizativa SERIAL,
  cnombreunidadorganizativa VARCHAR(250)  DEFAULT NULL,
  PRIMARY KEY (nidtunidadorganizativa)
);


CREATE TABLE tunidadtramite (
  ccodigo VARCHAR(20) NOT NULL,
  nidtunidadorganizativa int NOT NULL,
  PRIMARY KEY (ccodigo,nidtunidadorganizativa)
);


CREATE TABLE tusuario (
  cidtusuario VARCHAR(10)  NOT NULL,
  nidttipousuario int DEFAULT NULL,
  cdni VARCHAR(10)  DEFAULT NULL,
  ccodigo VARCHAR(20)  DEFAULT NULL,
  cnombres VARCHAR(45)  DEFAULT NULL,
  cpaterno VARCHAR(45)  DEFAULT NULL,
  cmaterno VARCHAR(45)  DEFAULT NULL,
  ccorreo VARCHAR(45)  DEFAULT NULL,
  dfechanacimiento TIMESTAMP DEFAULT NULL,
  ctelefono VARCHAR(20)  DEFAULT NULL,
  PRIMARY KEY (cidtusuario)
);


ALTER TABLE tcomisionbancoaplicacion ADD CONSTRAINT tcomisionbancoaplicacion_ibfk_1 FOREIGN KEY (nidtsolicitudtramite) REFERENCES tsolicitudtramite (nidtsolicitudtramite);
ALTER TABLE tcomisionbancoaplicacion ADD CONSTRAINT tcomisionbancoaplicacion_ibfk_2 FOREIGN KEY (nidtcomisionbanco) REFERENCES tcomisionbanco (nidtcomisionbanco);
ALTER TABLE tcomprobantepago ADD CONSTRAINT tcomprobantepago_ibfk_1 FOREIGN KEY (nidtdependenciapago) REFERENCES tunidadorganizativa (nidtunidadorganizativa);
ALTER TABLE tcomprobantepago ADD CONSTRAINT tcomprobantepago_ibfk_2 FOREIGN KEY (nidtserieunidadtramite) REFERENCES tserieunidadtramite (nidtserieunidadtramite);
ALTER TABLE tdetallecomprobantepago ADD CONSTRAINT tdetallecomprobantepago_ibfk_1 FOREIGN KEY (cnumerocomprobante, cserie) REFERENCES tcomprobantepago (cnumerocomprobante, cserie);
ALTER TABLE tdetallecomprobantepago ADD CONSTRAINT tdetallecomprobantepago_ibfk_2 FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE tdetalleconfiguracion ADD CONSTRAINT tdetalleconfiguracion_ibfk_1 FOREIGN KEY (nidtconfiguracion) REFERENCES tconfiguracion (nidtconfiguracion);
ALTER TABLE tdetalletramite ADD CONSTRAINT tdetalletramite_ibfk_1 FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE tdocumentoexpediente ADD CONSTRAINT fk_documento_expediente FOREIGN KEY (nidtexpediente) REFERENCES texpediente (nidtexpediente);
ALTER TABLE tdocumentoexpediente ADD CONSTRAINT fk_documento_requisito FOREIGN KEY (nidtrequisitotramite) REFERENCES trequisitotramite (nidtrequisitotramite);
ALTER TABLE tespecifica ADD CONSTRAINT nidtiporeciboingreso FOREIGN KEY (nidtiporeciboingreso) REFERENCES ttiporeciboingreso (nidtiporeciboingreso);
ALTER TABLE tespecifica ADD CONSTRAINT nidttipoespecifica FOREIGN KEY (nidttipoespecifica) REFERENCES tdetalleconfiguracion (nidtdetalleconfiguracion);
ALTER TABLE tespecificatramite ADD CONSTRAINT tespecificatramite_ibfk_1 FOREIGN KEY (ccodigoespecifica) REFERENCES tespecifica (ccodigoespecifica);
ALTER TABLE tespecificatramite ADD CONSTRAINT tespecificatramite_ibfk_2 FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE texpediente ADD CONSTRAINT fk_expediente_oficina FOREIGN KEY (nidtoficinaactual) REFERENCES tunidadorganizativa (nidtunidadorganizativa);
ALTER TABLE texpediente ADD CONSTRAINT fk_expediente_tramite FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE texpediente ADD CONSTRAINT fk_expediente_usuario FOREIGN KEY (cidtusuario) REFERENCES tusuario (cidtusuario);
ALTER TABLE tflujoderivacion ADD CONSTRAINT fk_flujo_destino FOREIGN KEY (oficina_destino) REFERENCES tunidadorganizativa (nidtunidadorganizativa);
ALTER TABLE tflujoderivacion ADD CONSTRAINT fk_flujo_origen FOREIGN KEY (oficina_origen) REFERENCES tunidadorganizativa (nidtunidadorganizativa);
ALTER TABLE tflujoderivacion ADD CONSTRAINT fk_flujo_tramite FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE thistorialcatalogo ADD CONSTRAINT fk_historial_tramite FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE thistorialcatalogo ADD CONSTRAINT fk_historial_usuario FOREIGN KEY (usuario) REFERENCES tusuario (cidtusuario);
ALTER TABLE tlogin ADD CONSTRAINT fk_login_oficina FOREIGN KEY (nidtunidadorganizativa) REFERENCES tunidadorganizativa (nidtunidadorganizativa);
ALTER TABLE tlogin ADD CONSTRAINT fk_tlogin_tperfil1 FOREIGN KEY (nidtperfil) REFERENCES tperfil (nidtperfil);
ALTER TABLE tlogin ADD CONSTRAINT tlogin_ibfk_1 FOREIGN KEY (cidtusuario) REFERENCES tusuario (cidtusuario);
ALTER TABLE tmenuperfil ADD CONSTRAINT fk_tmenuperfil_tmodulo1 FOREIGN KEY (nidtmodulo) REFERENCES tmodulo (nidtmodulo);
ALTER TABLE tmenuperfil ADD CONSTRAINT fk_tmenuperfil_tperfil1 FOREIGN KEY (nidtperfil) REFERENCES tperfil (nidtperfil);
ALTER TABLE tmodulo ADD CONSTRAINT fk_tmodulo_tagrupadormodulo1 FOREIGN KEY (nidtagrupadormodulo) REFERENCES tagrupadormodulo (nidtagrupadormodulo);
ALTER TABLE tmontotramite ADD CONSTRAINT fk_tmontotramite_tcatalogotramite FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE tmovimientoexpediente ADD CONSTRAINT fk_movimiento_expediente FOREIGN KEY (nro_expediente) REFERENCES texpediente (cnroexpediente);
ALTER TABLE tmovimientoexpediente ADD CONSTRAINT fk_movimiento_oficina_anterior FOREIGN KEY (oficina_anterior) REFERENCES tunidadorganizativa (nidtunidadorganizativa);
ALTER TABLE tmovimientoexpediente ADD CONSTRAINT fk_movimiento_oficina_nueva FOREIGN KEY (oficina_nueva) REFERENCES tunidadorganizativa (nidtunidadorganizativa);
ALTER TABLE tmovimientoexpediente ADD CONSTRAINT fk_movimiento_requisito FOREIGN KEY (id_requisito_observado) REFERENCES trequisitotramite (nidtrequisitotramite);
ALTER TABLE tmovimientoexpediente ADD CONSTRAINT fk_movimiento_usuario FOREIGN KEY (usuario_responsable) REFERENCES tusuario (cidtusuario);
ALTER TABLE tnotificacion ADD CONSTRAINT fk_notificacion_expediente FOREIGN KEY (nro_expediente) REFERENCES texpediente (cnroexpediente);
ALTER TABLE tnotificacion ADD CONSTRAINT fk_notificacion_usuario FOREIGN KEY (id_usuario) REFERENCES tusuario (cidtusuario);
ALTER TABLE treciboingreso ADD CONSTRAINT treciboingreso_ibfk_1 FOREIGN KEY (nidtiporeciboingreso) REFERENCES ttiporeciboingreso (nidtiporeciboingreso);
ALTER TABLE treciboingreso ADD CONSTRAINT treciboingreso_ibfk_2 FOREIGN KEY (clogin) REFERENCES tlogin (clogin);
ALTER TABLE treciboingresodetalle ADD CONSTRAINT treciboingresodetalle_ibfk_1 FOREIGN KEY (nidtreciboingreso) REFERENCES treciboingreso (nidtreciboingreso);
ALTER TABLE treciboingresodetalle ADD CONSTRAINT treciboingresodetalle_ibfk_2 FOREIGN KEY (nidtsolicitudtramitedetalle) REFERENCES tsolicitudtramitedetalle (nidtsolicitudtramitedetalle);
ALTER TABLE trequisitotramite ADD CONSTRAINT fk_trequisitotramite_tcatalogotramite1 FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE tserieunidadtramite ADD CONSTRAINT tserieunidadtramite_ibfk_1 FOREIGN KEY (nidtunidadorganizativa) REFERENCES tunidadorganizativa (nidtunidadorganizativa);
ALTER TABLE tsolicitanteespecialidad ADD CONSTRAINT tsolicitanteespecialidad_ibfk_1 FOREIGN KEY (ccodigosolicitante) REFERENCES tsolicitante (ccodigosolicitante);
ALTER TABLE tsolicitanteespecialidad ADD CONSTRAINT tsolicitanteespecialidad_ibfk_2 FOREIGN KEY (ccodigoespecialidad) REFERENCES tespecialidad (ccodigoespecialidad);
ALTER TABLE tsolicitudtramite ADD CONSTRAINT tsolicitudtramite_ibfk_3 FOREIGN KEY (nidttiposolicitante) REFERENCES tdetalleconfiguracion (nidtdetalleconfiguracion);
ALTER TABLE tsolicitudtramite ADD CONSTRAINT tsolicitudtramite_ibfk_4 FOREIGN KEY (ccodigosolicitante) REFERENCES tsolicitante (ccodigosolicitante);
ALTER TABLE tsolicitudtramitedetalle ADD CONSTRAINT tsolicitudtramitedetalle_ibfk_1 FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE tsolicitudtramitedetalle ADD CONSTRAINT tsolicitudtramitedetalle_ibfk_2 FOREIGN KEY (nidtmontotramite) REFERENCES tmontotramite (nidtmontotramite);
ALTER TABLE tsolicitudtramitedetalle ADD CONSTRAINT tsolicitudtramitedetalle_ibfk_3 FOREIGN KEY (nidtsolicitudtramite) REFERENCES tsolicitudtramite (nidtsolicitudtramite);
ALTER TABLE tunidadtramite ADD CONSTRAINT tunidadtramite_ibfk_1 FOREIGN KEY (ccodigo) REFERENCES tcatalogotramite (ccodigo);
ALTER TABLE tunidadtramite ADD CONSTRAINT tunidadtramite_ibfk_2 FOREIGN KEY (nidtunidadorganizativa) REFERENCES tunidadorganizativa (nidtunidadorganizativa);
ALTER TABLE tusuario ADD CONSTRAINT tusuario_ibfk_1 FOREIGN KEY (nidttipousuario) REFERENCES tdetalleconfiguracion (nidtdetalleconfiguracion);
