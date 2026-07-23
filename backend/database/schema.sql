-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: bdtupa
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contador_expediente`
--

DROP TABLE IF EXISTS `contador_expediente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contador_expediente` (
  `anio` int NOT NULL,
  `tipo` varchar(10) NOT NULL,
  `ultimo_numero` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`anio`,`tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `registro_auditoria`
--

DROP TABLE IF EXISTS `registro_auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_auditoria` (
  `id_registro` int NOT NULL AUTO_INCREMENT,
  `correo_ingresado` varchar(120) DEFAULT NULL,
  `direccion_ip` varchar(45) NOT NULL,
  `resultado` enum('EXITOSO','FALLIDO','ERROR_SISTEMA') NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_registro`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tagrupadormodulo`
--

DROP TABLE IF EXISTS `tagrupadormodulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tagrupadormodulo` (
  `nidtagrupadormodulo` int NOT NULL AUTO_INCREMENT,
  `cdescripcionagrupador` varchar(50) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  `ciconoagrupador` varchar(45) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`nidtagrupadormodulo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `talumno`
--

DROP TABLE IF EXISTS `talumno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `talumno` (
  `codigoalumno` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `apalumno` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amalumno` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombresalumno` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dni` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'SI',
  `ultimoacceso` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observacion_al` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexoalumno` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fechanac` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `curricula` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigoespecialidad` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigosede` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`codigoalumno`),
  KEY `fk_cosede` (`codigosede`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `talumnocalca`
--

DROP TABLE IF EXISTS `talumnocalca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `talumnocalca` (
  `codigoalumno` varchar(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `apalumno` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `amalumno` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `nombresalumno` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `dni` varchar(8) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `usuario` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `password` varchar(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `activo` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `ultimoacceso` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `observacion_al` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `sexoalumno` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fechanac` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `direccion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `telefono` varchar(9) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `foto` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `curricula` varchar(4) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codigoespecialidad` varchar(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codigosede` varchar(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `talumnochecacupe`
--

DROP TABLE IF EXISTS `talumnochecacupe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `talumnochecacupe` (
  `codigoalumno` varchar(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `apalumno` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `amalumno` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `nombresalumno` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `dni` varchar(8) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `usuario` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `password` varchar(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `activo` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `ultimoacceso` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `observacion_al` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `sexoalumno` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fechanac` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `direccion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `telefono` varchar(9) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `foto` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `curricula` varchar(4) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codigoespecialidad` varchar(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codigosede` varchar(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `talumnocusco`
--

DROP TABLE IF EXISTS `talumnocusco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `talumnocusco` (
  `codigoalumno` varchar(8) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `apalumno` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `amalumno` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `nombresalumno` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `dni` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `usuario` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `password` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `activo` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'SI',
  `ultimoacceso` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `observacion_al` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `sexoalumno` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fechanac` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `direccion` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `telefono` varchar(9) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `foto` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `curricula` varchar(4) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codigoespecialidad` varchar(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codigosede` varchar(3) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tcatalogotramite`
--

DROP TABLE IF EXISTS `tcatalogotramite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tcatalogotramite` (
  `ccodigo` varchar(20) NOT NULL,
  `cdenominaciontramite` varchar(200) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  `cdescripcion` varchar(1000) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  `ccodigobanco` varchar(10) DEFAULT NULL,
  `btienemontofijo` tinyint(1) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `nplazodias` int DEFAULT NULL,
  PRIMARY KEY (`ccodigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tcomisionbanco`
--

DROP TABLE IF EXISTS `tcomisionbanco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tcomisionbanco` (
  `nidtcomisionbanco` int NOT NULL AUTO_INCREMENT,
  `dfechainicio` datetime DEFAULT NULL,
  `dfechafin` datetime DEFAULT NULL,
  `nmonto` decimal(10,2) DEFAULT NULL,
  `ccodigoespecifica` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`nidtcomisionbanco`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tcomisionbancoaplicacion`
--

DROP TABLE IF EXISTS `tcomisionbancoaplicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tcomisionbancoaplicacion` (
  `nidtcomisionbancoaplicacion` int NOT NULL AUTO_INCREMENT,
  `nidtsolicitudtramite` bigint DEFAULT NULL,
  `nidtcomisionbanco` int DEFAULT NULL,
  `cdescripcion` text,
  `nmontocomision` decimal(10,2) DEFAULT NULL,
  `ccodigoespecifica` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`nidtcomisionbancoaplicacion`),
  KEY `nidtsolicitudtramite` (`nidtsolicitudtramite`),
  KEY `nidtcomisionbanco` (`nidtcomisionbanco`),
  CONSTRAINT `tcomisionbancoaplicacion_ibfk_1` FOREIGN KEY (`nidtsolicitudtramite`) REFERENCES `tsolicitudtramite` (`nidtsolicitudtramite`),
  CONSTRAINT `tcomisionbancoaplicacion_ibfk_2` FOREIGN KEY (`nidtcomisionbanco`) REFERENCES `tcomisionbanco` (`nidtcomisionbanco`)
) ENGINE=InnoDB AUTO_INCREMENT=1670 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tcomprobantepago`
--

DROP TABLE IF EXISTS `tcomprobantepago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tcomprobantepago` (
  `cnumerocomprobante` varchar(10) NOT NULL,
  `nidtserieunidadtramite` int DEFAULT NULL,
  `cserie` varchar(6) NOT NULL,
  `nidtdependenciapago` int DEFAULT NULL,
  `cidtusuario` varchar(10) DEFAULT NULL,
  `dfechaemision` datetime DEFAULT NULL,
  `cusuarioregistro` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`cnumerocomprobante`,`cserie`),
  KEY `nidtdependenciapago` (`nidtdependenciapago`),
  KEY `nidtserieunidadtramite` (`nidtserieunidadtramite`),
  CONSTRAINT `tcomprobantepago_ibfk_1` FOREIGN KEY (`nidtdependenciapago`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `tcomprobantepago_ibfk_2` FOREIGN KEY (`nidtserieunidadtramite`) REFERENCES `tserieunidadtramite` (`nidtserieunidadtramite`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tconfiguracion`
--

DROP TABLE IF EXISTS `tconfiguracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tconfiguracion` (
  `nidtconfiguracion` int NOT NULL AUTO_INCREMENT,
  `cdescripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`nidtconfiguracion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tdetallecomprobantepago`
--

DROP TABLE IF EXISTS `tdetallecomprobantepago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tdetallecomprobantepago` (
  `cnumerocomprobante` varchar(10) NOT NULL,
  `cserie` varchar(6) NOT NULL,
  `ccodigo` varchar(20) DEFAULT NULL,
  `cdescripcionpago` varchar(100) DEFAULT NULL,
  `ncantidad` int DEFAULT NULL,
  PRIMARY KEY (`cnumerocomprobante`,`cserie`),
  KEY `ccodigo` (`ccodigo`),
  CONSTRAINT `tdetallecomprobantepago_ibfk_1` FOREIGN KEY (`cnumerocomprobante`, `cserie`) REFERENCES `tcomprobantepago` (`cnumerocomprobante`, `cserie`),
  CONSTRAINT `tdetallecomprobantepago_ibfk_2` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tdetalleconfiguracion`
--

DROP TABLE IF EXISTS `tdetalleconfiguracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tdetalleconfiguracion` (
  `nidtdetalleconfiguracion` int NOT NULL AUTO_INCREMENT,
  `nidtconfiguracion` int DEFAULT NULL,
  `cdescripciondetalleconfiguracion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`nidtdetalleconfiguracion`),
  KEY `nidtconfiguracion` (`nidtconfiguracion`),
  CONSTRAINT `tdetalleconfiguracion_ibfk_1` FOREIGN KEY (`nidtconfiguracion`) REFERENCES `tconfiguracion` (`nidtconfiguracion`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tdetalletramite`
--

DROP TABLE IF EXISTS `tdetalletramite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tdetalletramite` (
  `nidtdetalletramite` int NOT NULL AUTO_INCREMENT,
  `ccodigo` varchar(20) DEFAULT NULL,
  `cdenominaciondetalle` varchar(300) DEFAULT NULL,
  `cvalordetalle` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`nidtdetalletramite`),
  KEY `ccodigo` (`ccodigo`),
  CONSTRAINT `tdetalletramite_ibfk_1` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tdocumentoexpediente`
--

DROP TABLE IF EXISTS `tdocumentoexpediente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tdocumentoexpediente` (
  `nidtdocumentoexpediente` int NOT NULL AUTO_INCREMENT,
  `nidtexpediente` int NOT NULL,
  `nidtrequisitotramite` int NOT NULL,
  `cnombrearchivooriginal` varchar(255) NOT NULL,
  `crutaarchivo` varchar(255) NOT NULL,
  `cformatoarchivo` varchar(10) NOT NULL,
  `ntamaniobytes` int NOT NULL,
  `dfechasubida` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nidtdocumentoexpediente`),
  UNIQUE KEY `uq_documento_expediente_requisito` (`nidtexpediente`,`nidtrequisitotramite`),
  KEY `fk_documento_requisito` (`nidtrequisitotramite`),
  CONSTRAINT `fk_documento_expediente` FOREIGN KEY (`nidtexpediente`) REFERENCES `texpediente` (`nidtexpediente`),
  CONSTRAINT `fk_documento_requisito` FOREIGN KEY (`nidtrequisitotramite`) REFERENCES `trequisitotramite` (`nidtrequisitotramite`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tespecialidad`
--

DROP TABLE IF EXISTS `tespecialidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tespecialidad` (
  `ccodigoespecialidad` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnombreespecialidad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ccodigoespecialidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tespecifica`
--

DROP TABLE IF EXISTS `tespecifica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tespecifica` (
  `ccodigoespecifica` varchar(20) NOT NULL,
  `nidttipoespecifica` int NOT NULL,
  `nidtiporeciboingreso` int DEFAULT NULL,
  `ctipoespecifica` varchar(50) DEFAULT NULL,
  `cdescripcionespecifica` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ccodigoespecifica`),
  KEY `nidttipoespecifica` (`nidttipoespecifica`),
  KEY `nidtiporeciboingreso_idx` (`nidtiporeciboingreso`),
  CONSTRAINT `nidtiporeciboingreso` FOREIGN KEY (`nidtiporeciboingreso`) REFERENCES `ttiporeciboingreso` (`nidtiporeciboingreso`),
  CONSTRAINT `nidttipoespecifica` FOREIGN KEY (`nidttipoespecifica`) REFERENCES `tdetalleconfiguracion` (`nidtdetalleconfiguracion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tespecificatramite`
--

DROP TABLE IF EXISTS `tespecificatramite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tespecificatramite` (
  `ccodigoespecifica` varchar(20) NOT NULL,
  `ccodigo` varchar(20) NOT NULL,
  `dfechainicio` datetime DEFAULT NULL,
  `dfechafin` datetime DEFAULT NULL,
  `bvigente` bit(1) DEFAULT NULL,
  PRIMARY KEY (`ccodigoespecifica`,`ccodigo`),
  KEY `ccodigo` (`ccodigo`),
  CONSTRAINT `tespecificatramite_ibfk_1` FOREIGN KEY (`ccodigoespecifica`) REFERENCES `tespecifica` (`ccodigoespecifica`),
  CONSTRAINT `tespecificatramite_ibfk_2` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `texpediente`
--

DROP TABLE IF EXISTS `texpediente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `texpediente` (
  `nidtexpediente` int NOT NULL AUTO_INCREMENT,
  `cnroexpediente` varchar(20) NOT NULL,
  `cidtusuario` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ccodigo` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nidtoficinaactual` int NOT NULL,
  `cestado` enum('BORRADOR','PENDIENTE','EN_REVISION','OBSERVADO','APROBADO','RECHAZADO') NOT NULL DEFAULT 'BORRADOR',
  `dfecharegistro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dfechavencimiento` date DEFAULT NULL,
  `cnumerovoucher` varchar(20) DEFAULT NULL,
  `nmontovoucher` decimal(10,2) DEFAULT NULL,
  `dfechapagovoucher` date DEFAULT NULL,
  `cestadovoucher` enum('PENDIENTE_VALIDACION','VALIDADO','RECHAZADO') DEFAULT NULL,
  `cmotivorechazovoucher` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nidtexpediente`),
  UNIQUE KEY `cnroexpediente` (`cnroexpediente`),
  KEY `fk_expediente_usuario` (`cidtusuario`),
  KEY `fk_expediente_tramite` (`ccodigo`),
  KEY `fk_expediente_oficina` (`nidtoficinaactual`),
  CONSTRAINT `fk_expediente_oficina` FOREIGN KEY (`nidtoficinaactual`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `fk_expediente_tramite` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`),
  CONSTRAINT `fk_expediente_usuario` FOREIGN KEY (`cidtusuario`) REFERENCES `tusuario` (`cidtusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tferiado`
--

DROP TABLE IF EXISTS `tferiado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tferiado` (
  `nidtferidado` int NOT NULL AUTO_INCREMENT,
  `dfecha` date NOT NULL,
  `cdescripcion` varchar(100) DEFAULT NULL,
  `brecurrente` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`nidtferidado`),
  UNIQUE KEY `dfecha` (`dfecha`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tflujoderivacion`
--

DROP TABLE IF EXISTS `tflujoderivacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tflujoderivacion` (
  `id_flujo` int NOT NULL AUTO_INCREMENT,
  `ccodigo` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `oficina_origen` int NOT NULL,
  `oficina_destino` int NOT NULL,
  PRIMARY KEY (`id_flujo`),
  KEY `fk_flujo_tramite` (`ccodigo`),
  KEY `fk_flujo_origen` (`oficina_origen`),
  KEY `fk_flujo_destino` (`oficina_destino`),
  CONSTRAINT `fk_flujo_destino` FOREIGN KEY (`oficina_destino`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `fk_flujo_origen` FOREIGN KEY (`oficina_origen`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `fk_flujo_tramite` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tlogin`
--

DROP TABLE IF EXISTS `tlogin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tlogin` (
  `clogin` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cidtusuario` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nidtperfil` int NOT NULL,
  `dfechainicio` datetime DEFAULT NULL,
  `dfechafin` datetime DEFAULT NULL,
  `ccontrasenia` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intentos_fallidos` int NOT NULL DEFAULT '0',
  `fecha_bloqueo` datetime DEFAULT NULL,
  `nidtunidadorganizativa` int DEFAULT NULL,
  PRIMARY KEY (`clogin`),
  KEY `fk_tlogin_tperfil1_idx` (`nidtperfil`),
  KEY `cidtusuario` (`cidtusuario`),
  KEY `fk_login_oficina` (`nidtunidadorganizativa`),
  CONSTRAINT `fk_login_oficina` FOREIGN KEY (`nidtunidadorganizativa`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `fk_tlogin_tperfil1` FOREIGN KEY (`nidtperfil`) REFERENCES `tperfil` (`nidtperfil`),
  CONSTRAINT `tlogin_ibfk_1` FOREIGN KEY (`cidtusuario`) REFERENCES `tusuario` (`cidtusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tmenuperfil`
--

DROP TABLE IF EXISTS `tmenuperfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tmenuperfil` (
  `nidtmenuperfil` int NOT NULL AUTO_INCREMENT,
  `nidtmodulo` int NOT NULL,
  `nidtperfil` int NOT NULL,
  PRIMARY KEY (`nidtmenuperfil`),
  KEY `fk_tmenuperfil_tmodulo1_idx` (`nidtmodulo`),
  KEY `fk_tmenuperfil_tperfil1_idx` (`nidtperfil`),
  CONSTRAINT `fk_tmenuperfil_tmodulo1` FOREIGN KEY (`nidtmodulo`) REFERENCES `tmodulo` (`nidtmodulo`),
  CONSTRAINT `fk_tmenuperfil_tperfil1` FOREIGN KEY (`nidtperfil`) REFERENCES `tperfil` (`nidtperfil`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tmodulo`
--

DROP TABLE IF EXISTS `tmodulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tmodulo` (
  `nidtmodulo` int NOT NULL AUTO_INCREMENT,
  `nidtagrupadormodulo` int NOT NULL,
  `cdescripcionmodulo` varchar(250) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  `ciconomodulo` varchar(45) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  `crutamodulo` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`nidtmodulo`),
  KEY `fk_tmodulo_tagrupadormodulo1_idx` (`nidtagrupadormodulo`),
  CONSTRAINT `fk_tmodulo_tagrupadormodulo1` FOREIGN KEY (`nidtagrupadormodulo`) REFERENCES `tagrupadormodulo` (`nidtagrupadormodulo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tmontotramite`
--

DROP TABLE IF EXISTS `tmontotramite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tmontotramite` (
  `nidtmontotramite` int NOT NULL AUTO_INCREMENT,
  `ccodigo` varchar(20) NOT NULL,
  `nmonto` decimal(10,2) DEFAULT NULL,
  `cdescripcionpago` varchar(300) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  `dfechainicio` datetime DEFAULT NULL,
  `dfechafin` datetime DEFAULT NULL,
  PRIMARY KEY (`nidtmontotramite`),
  KEY `fk_tmontotramite_tcatalogotramite_idx` (`ccodigo`),
  CONSTRAINT `fk_tmontotramite_tcatalogotramite` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tmovimientoexpediente`
--

DROP TABLE IF EXISTS `tmovimientoexpediente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tmovimientoexpediente` (
  `id_movimiento` int NOT NULL AUTO_INCREMENT,
  `nro_expediente` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `estado_anterior` varchar(20) DEFAULT NULL,
  `estado_nuevo` varchar(20) NOT NULL,
  `comentario` text,
  `id_requisito_observado` int DEFAULT NULL,
  `usuario_responsable` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `oficina_anterior` int DEFAULT NULL,
  `oficina_nueva` int DEFAULT NULL,
  PRIMARY KEY (`id_movimiento`),
  KEY `fk_movimiento_expediente` (`nro_expediente`),
  KEY `fk_movimiento_usuario` (`usuario_responsable`),
  KEY `fk_movimiento_requisito` (`id_requisito_observado`),
  KEY `fk_movimiento_oficina_anterior` (`oficina_anterior`),
  KEY `fk_movimiento_oficina_nueva` (`oficina_nueva`),
  CONSTRAINT `fk_movimiento_expediente` FOREIGN KEY (`nro_expediente`) REFERENCES `texpediente` (`cnroexpediente`),
  CONSTRAINT `fk_movimiento_oficina_anterior` FOREIGN KEY (`oficina_anterior`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `fk_movimiento_oficina_nueva` FOREIGN KEY (`oficina_nueva`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `fk_movimiento_requisito` FOREIGN KEY (`id_requisito_observado`) REFERENCES `trequisitotramite` (`nidtrequisitotramite`),
  CONSTRAINT `fk_movimiento_usuario` FOREIGN KEY (`usuario_responsable`) REFERENCES `tusuario` (`cidtusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tnotificacion`
--

DROP TABLE IF EXISTS `tnotificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tnotificacion` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nro_expediente` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mensaje` varchar(255) NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_notificacion`),
  KEY `fk_notificacion_usuario` (`id_usuario`),
  KEY `fk_notificacion_expediente` (`nro_expediente`),
  CONSTRAINT `fk_notificacion_expediente` FOREIGN KEY (`nro_expediente`) REFERENCES `texpediente` (`cnroexpediente`),
  CONSTRAINT `fk_notificacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `tusuario` (`cidtusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tperfil`
--

DROP TABLE IF EXISTS `tperfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tperfil` (
  `nidtperfil` int NOT NULL AUTO_INCREMENT,
  `cdescripcionperfil` varchar(100) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`nidtperfil`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `treciboingreso`
--

DROP TABLE IF EXISTS `treciboingreso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treciboingreso` (
  `nidtreciboingreso` int NOT NULL AUTO_INCREMENT,
  `nnrorecibo` int DEFAULT NULL,
  `nanio` int DEFAULT NULL,
  `nidtiporeciboingreso` int DEFAULT NULL,
  `clogin` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dfecharecibo` datetime DEFAULT NULL,
  `cnumerosiaf` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dfecharegistro` datetime DEFAULT NULL,
  `cobservacion` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnotapago` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cexpedientesiaf` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cordenservicio` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cruc` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cproveedor` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cfactura` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cguiaremision` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crubro` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccorrelativocut` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctiporubro` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`nidtreciboingreso`),
  KEY `nidtiporeciboingreso` (`nidtiporeciboingreso`),
  KEY `clogin` (`clogin`),
  CONSTRAINT `treciboingreso_ibfk_1` FOREIGN KEY (`nidtiporeciboingreso`) REFERENCES `ttiporeciboingreso` (`nidtiporeciboingreso`),
  CONSTRAINT `treciboingreso_ibfk_2` FOREIGN KEY (`clogin`) REFERENCES `tlogin` (`clogin`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `treciboingresodetalle`
--

DROP TABLE IF EXISTS `treciboingresodetalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treciboingresodetalle` (
  `nidtreciboingresodetalle` int NOT NULL AUTO_INCREMENT,
  `nidtreciboingreso` int DEFAULT NULL,
  `nidtsolicitudtramitedetalle` int DEFAULT NULL,
  `ccodigoespecifica` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccodigo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nmontotramite` decimal(10,2) DEFAULT NULL,
  `ctransaccion` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`nidtreciboingresodetalle`),
  KEY `nidtreciboingreso` (`nidtreciboingreso`),
  KEY `nidtsolicitudtramitedetalle` (`nidtsolicitudtramitedetalle`),
  CONSTRAINT `treciboingresodetalle_ibfk_1` FOREIGN KEY (`nidtreciboingreso`) REFERENCES `treciboingreso` (`nidtreciboingreso`),
  CONSTRAINT `treciboingresodetalle_ibfk_2` FOREIGN KEY (`nidtsolicitudtramitedetalle`) REFERENCES `tsolicitudtramitedetalle` (`nidtsolicitudtramitedetalle`)
) ENGINE=InnoDB AUTO_INCREMENT=2355 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trequisitotramite`
--

DROP TABLE IF EXISTS `trequisitotramite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trequisitotramite` (
  `nidtrequisitotramite` int NOT NULL AUTO_INCREMENT,
  `ccodigo` varchar(20) NOT NULL,
  `cdescripcionrequisito` varchar(400) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  `bobligatorio` tinyint(1) NOT NULL DEFAULT '1',
  `cformatospermitidos` varchar(50) NOT NULL DEFAULT 'pdf,jpg,png',
  `nmaxtamaniomb` int NOT NULL DEFAULT '5',
  PRIMARY KEY (`nidtrequisitotramite`),
  KEY `fk_trequisitotramite_tcatalogotramite1_idx` (`ccodigo`),
  CONSTRAINT `fk_trequisitotramite_tcatalogotramite1` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tserieunidadtramite`
--

DROP TABLE IF EXISTS `tserieunidadtramite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tserieunidadtramite` (
  `nidtserieunidadtramite` int NOT NULL AUTO_INCREMENT,
  `cserie` varchar(6) DEFAULT NULL,
  `nidtunidadorganizativa` int DEFAULT NULL,
  `bvigente` bit(1) DEFAULT NULL,
  PRIMARY KEY (`nidtserieunidadtramite`),
  KEY `nidtunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `tserieunidadtramite_ibfk_1` FOREIGN KEY (`nidtunidadorganizativa`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsolicitante`
--

DROP TABLE IF EXISTS `tsolicitante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsolicitante` (
  `ccodigosolicitante` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnumerodocumento` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnombres` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capellidopaterno` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capellidomaterno` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ccodigosolicitante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsolicitanteespecialidad`
--

DROP TABLE IF EXISTS `tsolicitanteespecialidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsolicitanteespecialidad` (
  `ccodigosolicitante` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnumerodocumento` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ccodigoespecialidad` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnombreespecialidad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ccodigosolicitante`,`ccodigoespecialidad`),
  KEY `ccodigoespecialidad` (`ccodigoespecialidad`),
  CONSTRAINT `tsolicitanteespecialidad_ibfk_1` FOREIGN KEY (`ccodigosolicitante`) REFERENCES `tsolicitante` (`ccodigosolicitante`),
  CONSTRAINT `tsolicitanteespecialidad_ibfk_2` FOREIGN KEY (`ccodigoespecialidad`) REFERENCES `tespecialidad` (`ccodigoespecialidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsolicitudtramite`
--

DROP TABLE IF EXISTS `tsolicitudtramite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsolicitudtramite` (
  `nidtsolicitudtramite` bigint NOT NULL AUTO_INCREMENT,
  `ccodigosolicitante` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nidttiposolicitante` int NOT NULL,
  `dfechapeticion` datetime NOT NULL,
  `dfecharegistro` datetime NOT NULL,
  `ccomprobantepath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnumerotransaccion` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dfechatransaccion` datetime DEFAULT NULL,
  `dhoratransaccion` datetime DEFAULT NULL,
  `cestado` enum('SOLICITADO','EN PROCESO','PAGADO','ANULADO','CERRADO','PAGADO SIN ADJUNTO') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SOLICITADO',
  `cidtsolicitudtramite` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nnumerotramite` int DEFAULT NULL,
  `dfechainiciovigencia` datetime DEFAULT NULL,
  `dfechafinvigencia` datetime DEFAULT NULL,
  `dfechasubidoarchivo` datetime DEFAULT NULL,
  `dfechapago` datetime DEFAULT NULL,
  `cnumerorecibocaja` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`nidtsolicitudtramite`),
  KEY `tsolicitudtramite_ibfk_3` (`nidttiposolicitante`),
  KEY `ccodigosolicitante` (`ccodigosolicitante`),
  CONSTRAINT `tsolicitudtramite_ibfk_3` FOREIGN KEY (`nidttiposolicitante`) REFERENCES `tdetalleconfiguracion` (`nidtdetalleconfiguracion`),
  CONSTRAINT `tsolicitudtramite_ibfk_4` FOREIGN KEY (`ccodigosolicitante`) REFERENCES `tsolicitante` (`ccodigosolicitante`)
) ENGINE=InnoDB AUTO_INCREMENT=2203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tsolicitudtramitedetalle`
--

DROP TABLE IF EXISTS `tsolicitudtramitedetalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tsolicitudtramitedetalle` (
  `nidtsolicitudtramitedetalle` int NOT NULL AUTO_INCREMENT,
  `nidtsolicitudtramite` bigint NOT NULL,
  `ccodigo` varchar(20) DEFAULT NULL,
  `nidtmontotramite` int DEFAULT NULL,
  `ncantidad` int DEFAULT NULL,
  `cdescripcion` text,
  `nmontotramite` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`nidtsolicitudtramitedetalle`),
  KEY `ccodigo` (`ccodigo`),
  KEY `nidtmontotramite` (`nidtmontotramite`),
  KEY `nidtsolicitudtramite` (`nidtsolicitudtramite`),
  CONSTRAINT `tsolicitudtramitedetalle_ibfk_1` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`),
  CONSTRAINT `tsolicitudtramitedetalle_ibfk_2` FOREIGN KEY (`nidtmontotramite`) REFERENCES `tmontotramite` (`nidtmontotramite`),
  CONSTRAINT `tsolicitudtramitedetalle_ibfk_3` FOREIGN KEY (`nidtsolicitudtramite`) REFERENCES `tsolicitudtramite` (`nidtsolicitudtramite`)
) ENGINE=InnoDB AUTO_INCREMENT=3806 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ttiporeciboingreso`
--

DROP TABLE IF EXISTS `ttiporeciboingreso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ttiporeciboingreso` (
  `nidtiporeciboingreso` int NOT NULL AUTO_INCREMENT,
  `cdescripcion` varchar(250) DEFAULT NULL,
  `cfuentefinanciamiento` varchar(50) DEFAULT NULL,
  `crubro` varchar(300) DEFAULT NULL,
  `ctiporecurso` varchar(300) DEFAULT NULL,
  `ctipooperacion` varchar(200) DEFAULT NULL,
  `ccuentabanco` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`nidtiporeciboingreso`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ttoken`
--

DROP TABLE IF EXISTS `ttoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ttoken` (
  `cidtsesion` varchar(20) NOT NULL,
  `cusuario` varchar(20) DEFAULT NULL,
  `ctoken` varchar(200) DEFAULT NULL,
  `cestado` varchar(200) DEFAULT NULL,
  `dfechatoken` datetime DEFAULT NULL,
  PRIMARY KEY (`cidtsesion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tunidadorganizativa`
--

DROP TABLE IF EXISTS `tunidadorganizativa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tunidadorganizativa` (
  `nidtunidadorganizativa` int NOT NULL AUTO_INCREMENT,
  `cnombreunidadorganizativa` varchar(250) CHARACTER SET latin1 COLLATE latin1_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`nidtunidadorganizativa`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tunidadtramite`
--

DROP TABLE IF EXISTS `tunidadtramite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tunidadtramite` (
  `ccodigo` varchar(20) NOT NULL,
  `nidtunidadorganizativa` int NOT NULL,
  PRIMARY KEY (`ccodigo`,`nidtunidadorganizativa`),
  KEY `nidtunidadorganizativa` (`nidtunidadorganizativa`),
  CONSTRAINT `tunidadtramite_ibfk_1` FOREIGN KEY (`ccodigo`) REFERENCES `tcatalogotramite` (`ccodigo`),
  CONSTRAINT `tunidadtramite_ibfk_2` FOREIGN KEY (`nidtunidadorganizativa`) REFERENCES `tunidadorganizativa` (`nidtunidadorganizativa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tusuario`
--

DROP TABLE IF EXISTS `tusuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tusuario` (
  `cidtusuario` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nidttipousuario` int DEFAULT NULL,
  `cdni` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccodigo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnombres` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpaterno` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cmaterno` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccorreo` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dfechanacimiento` datetime DEFAULT NULL,
  `ctelefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cidtusuario`),
  KEY `nidttipousuario` (`nidttipousuario`),
  CONSTRAINT `tusuario_ibfk_1` FOREIGN KEY (`nidttipousuario`) REFERENCES `tdetalleconfiguracion` (`nidtdetalleconfiguracion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'bdtupa'
--
/*!50003 DROP PROCEDURE IF EXISTS `CC_sp_mantenimiento_toficina` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CC_sp_mantenimiento_toficina`(
	pidtoficina int,
    pnombreoficina varchar(300),    
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO toficina(idtoficina,nombreoficina) 
        VALUES (pidtoficina,pnombreoficina); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update toficina set nombreoficina=pnombreoficina
        where idtoficina=pidtoficina;
	    select pidtoficina as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from toficina where idtoficina=pidtoficina;
          select pidtoficina as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_listar_solicitudes_por_tramite_pagado_o_sin_adjunto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_listar_solicitudes_por_tramite_pagado_o_sin_adjunto`(    
    IN pdfechapago DATETIME
)
BEGIN
    -- Crear tabla temporal
    DROP TEMPORARY TABLE IF EXISTS tmp;
    CREATE TEMPORARY TABLE tmp (
        nidtsolicitudtramite INT
    );

    -- Insertar registros en la tabla temporal
    INSERT INTO tmp (nidtsolicitudtramite)
    SELECT std.nidtsolicitudtramite
    FROM tsolicitudtramitedetalle std
    WHERE std.ccodigo = 'PA884011480';

    -- Seleccionar solicitudes con estado válido
    SELECT se.ccodigosolicitante,
		   se.ccodigoespecialidad,
           s.cnumerodocumento,
           s.cnombres,
           s.capellidopaterno,
           s.capellidomaterno,
		   std.nidtsolicitudtramitedetalle,
           std.nidtsolicitudtramite,
           st.dfechapago,
           case ccodigo when 'PA884011480' then 'MATREG'
						when 'SE88401C3F0' THEN 'CARNUNI'
                        when 'PA88401F560' THEN 'ASIGDESA'
                        when 'PA884016454' THEN 'MATEXT' 
                        end as ccodigo,
		   nidtmontotramite,
           ncantidad,
           cdescripcion,
           nmontotramite,
           0 as mora,
           0 as operacion,
           'Banco de la Nacion' as banco
    FROM tsolicitudtramite st
    INNER JOIN tmp 
        ON st.nidtsolicitudtramite = tmp.nidtsolicitudtramite
	inner join tsolicitante s
    on s.ccodigosolicitante=st.ccodigosolicitante
    INNER JOIN tsolicitudtramitedetalle std
        ON st.nidtsolicitudtramite = std.nidtsolicitudtramite
	inner join tsolicitanteespecialidad se
    on (s.ccodigosolicitante=se.ccodigosolicitante or s.ccodigosolicitante=se.cnumerodocumento)
    WHERE st.cestado IN  ('PAGADO','PAGADO SIN ADJUNTO','EN PROCESO')
    and DATE(st.dfechapago) = DATE(pdfechapago);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_listar_unidades_por_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_listar_unidades_por_tramite`(      
     pcodigo varchar(20)
)
BEGIN
   select uo.nidtunidadorganizativa,uo.cnombreunidadorganizativa 
   from tunidadtramite ut
   inner join tunidadorganizativa uo
   on ut.nidtunidadorganizativa=uo.nidtunidadorganizativa
   where ccodigo=pcodigo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_listar_unidades_por_tramite_para_seleccionar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_listar_unidades_por_tramite_para_seleccionar`(      
     pcodigo varchar(20)
)
BEGIN
   select ut.ccodigo, 
		uo.nidtunidadorganizativa,uo.cnombreunidadorganizativa 
   from (select * from tunidadtramite where ccodigo=pcodigo) ut
   right outer join tunidadorganizativa uo
   on ut.nidtunidadorganizativa=uo.nidtunidadorganizativa;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_rpt_recibo_ingreso_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_rpt_recibo_ingreso_id`(
    IN p_nidtreciboingreso INT,
    in p_nidtiporeciboingreso INT
)
BEGIN	
	if(p_nidtiporeciboingreso=1)then
		drop temporary table if exists tmp1;
        create temporary table tmp1 as
        select distinct s.nidtsolicitudtramite,nidtreciboingreso
		from treciboingresodetalle rid
		inner join tsolicitudtramitedetalle std
		on rid.nidtsolicitudtramitedetalle=std.nidtsolicitudtramitedetalle
		inner join tsolicitudtramite s
		on std.nidtsolicitudtramite=s.nidtsolicitudtramite
        where rid.nidtreciboingreso=p_nidtreciboingreso;
        
		select ri.nnrorecibo,
			   ri.nanio,
               ri.dfecharecibo,
               ri.cnumerosiaf,               
               ti.cdescripcion,
               ti.crubro as crubrotipo,
               ti.ctiporecurso,
               ti.ctipooperacion,
               ti.ccuentabanco,
               e.ccodigoespecifica,
               e.cdescripcionespecifica,
               std.ccodigo,
               ct.cdenominaciontramite,
               sum(rid.nmontotramite) as subtotal,
               sum(std.ncantidad) as cantidad
        from treciboingreso ri inner join treciboingresodetalle rid
        on ri.nidtreciboingreso=rid.nidtreciboingreso        
        inner join ttiporeciboingreso ti
        on ri.nidtiporeciboingreso=ti.nidtiporeciboingreso
        inner join tespecifica e 
        on rid.ccodigoespecifica=e.ccodigoespecifica and e.nidtiporeciboingreso=p_nidtiporeciboingreso
        inner join tsolicitudtramitedetalle std
        on rid.nidtsolicitudtramitedetalle=std.nidtsolicitudtramitedetalle
        inner join tcatalogotramite ct 
        on std.ccodigo=ct.ccodigo
        where ri.nidtreciboingreso=p_nidtreciboingreso
        group by ri.nnrorecibo,
			   ri.nanio,
               ri.dfecharecibo,
               ri.cnumerosiaf,               
               ti.cdescripcion,
               ti.crubro,
               ti.ctiporecurso,
               ti.ctipooperacion,
               ti.ccuentabanco,
               e.ccodigoespecifica,
               e.cdescripcionespecifica,
               std.ccodigo,
               ct.cdenominaciontramite
		union 
        select ri.nnrorecibo,
			   ri.nanio,
               ri.dfecharecibo,
               ri.cnumerosiaf,               
               ti.cdescripcion,
               ti.crubro as crubrotipo,
               ti.ctiporecurso,
               ti.ctipooperacion,
               ti.ccuentabanco, 
               cba.ccodigoespecifica,
               e.cdescripcionespecifica,
               cba.ccodigoespecifica,
               cba.cdescripcion,
               sum(cba.nmontocomision) as subtotal, 
               count(cba.nmontocomision) as cantidad
        from treciboingreso ri
        inner join ttiporeciboingreso ti
        on ri.nidtiporeciboingreso=ti.nidtiporeciboingreso
        inner join tmp1
        on ri.nidtreciboingreso=tmp1.nidtreciboingreso
        inner join tcomisionbancoaplicacion cba 
        on tmp1.nidtsolicitudtramite=cba.nidtsolicitudtramite
        inner join tespecifica e
        on cba.ccodigoespecifica=e.ccodigoespecifica        
        group by ri.nnrorecibo,
			   ri.nanio,
               ri.dfecharecibo,
               ri.cnumerosiaf,               
               ti.cdescripcion,
               ti.crubro,
               ti.ctiporecurso,
               ti.ctipooperacion,
               ti.ccuentabanco,
               cba.ccodigoespecifica,
               e.cdescripcionespecifica,               
               cba.cdescripcion;               		
    elseif(p_nidtiporeciboingreso=2)then
		select ri.nnrorecibo,
			   ri.nanio,
               ri.dfecharecibo,
               ri.cnumerosiaf,
               ri.cobservacion,
               ri.cnotapago,
               ri.cexpedientesiaf,
               ri.cordenservicio,
               ri.cruc,
               ri.cproveedor,
               ri.cfactura,
               ri.cguiaremision,
               ri.crubro as crubrorecibo,
               ri.ccorrelativocut,
               ri.ctiporubro,
               ti.cdescripcion,
               ti.crubro as crubrotipo,
               ti.ctiporecurso,
               ti.ctipooperacion,
               ti.ccuentabanco,
               e.ccodigoespecifica,
               e.cdescripcionespecifica,
               sum(rid.nmontotramite) as subtotal,
               sum(std.ncantidad) as cantidad
        from treciboingreso ri inner join treciboingresodetalle rid
        on ri.nidtreciboingreso=rid.nidtreciboingreso
        inner join ttiporeciboingreso ti
        on ri.nidtiporeciboingreso=ti.nidtiporeciboingreso
        inner join tespecifica e 
        on rid.ccodigoespecifica=e.ccodigoespecifica and e.nidtiporeciboingreso=p_nidtiporeciboingreso
        inner join tsolicitudtramitedetalle std
        on rid.nidtsolicitudtramitedetalle=std.nidtsolicitudtramitedetalle
        where ri.nidtreciboingreso=p_nidtreciboingreso
        group by ri.nnrorecibo,
			   ri.nanio,
               ri.dfecharecibo,
               ri.cnumerosiaf,
               ri.cobservacion,
               ri.cnotapago,
               ri.cexpedientesiaf,
               ri.cordenservicio,
               ri.cruc,
               ri.cproveedor,
               ri.cfactura,
               ri.cguiaremision,
               ri.crubro,
               ri.ccorrelativocut,
               ri.ctiporubro,
               ri.ctiporubro,
               ti.cdescripcion,
               ti.crubro,
               ti.ctiporecurso,
               ti.ctipooperacion,
               ti.ccuentabanco,
               e.ccodigoespecifica,
               e.cdescripcionespecifica;	
    end if;    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_rpt_registrar_ingreso_recibo_solicitud_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_rpt_registrar_ingreso_recibo_solicitud_tramite`(
    IN p_nidtsolicitudtramite INT,
    IN p_cidtsolicitudtramite varchar(10),
    IN c_ccomprobantepath varchar(255)
)
BEGIN	
    select cestado,ccomprobantepath 
        into @estado_aux,@ccomprobantepath
        from tsolicitudtramite 
		where cidtsolicitudtramite=p_cidtsolicitudtramite COLLATE utf8mb4_unicode_ci                
		and (cestado='SOLICITADO' OR cestado='PAGADO SIN ADJUNTO' OR cestado='CERRADO');
	if (@estado_aux is not null )then
    BEGIN		
        if(@estado_aux='CERRADO')then
			if(@ccomprobantepath is null) then 				
				update tsolicitudtramite set ccomprobantepath=c_ccomprobantepath,
								 dfechasubidoarchivo=now(),
                                 cestado='CERRADO'
				where cidtsolicitudtramite=p_cidtsolicitudtramite COLLATE utf8mb4_unicode_ci;                
                select 1 ncodigo, 'CORRECTO' as cestado, 'REGISTRO ACTUALIZADO' AS cmensaje; 
			else
				select -1 ncodigo, 'ERROR' as cestado, 'EL ARCHIVO YA SE SUBIO, YA SE PAGO Y ESTA CERRADO' AS cmensaje; 
            end if;
        else 			
			update tsolicitudtramite set ccomprobantepath=c_ccomprobantepath,
								 dfechasubidoarchivo=now(),
                                 cestado=if(@estado_aux='SOLICITADO','EN PROCESO','PAGADO')
			where cidtsolicitudtramite=p_cidtsolicitudtramite COLLATE utf8mb4_unicode_ci;
            select 1 ncodigo, 'CORRECTO' as cestado, 'REGISTRO ACTUALIZADO' AS cmensaje; 
        end if;        
	END;
    ELSE
		select -1 ncodigo, 'ERROR' as cestado, 'EL REGISTRO NO ESTA DISPONIBLE' AS cmensaje; 
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_rpt_retornar_recibo_caja_solicitud_tramite_por_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_rpt_retornar_recibo_caja_solicitud_tramite_por_id`(
    IN p_nidtsolicitudtramite INT
)
BEGIN
    SELECT 
        s.*,
        st.dfechapeticion,
        st.dfecharegistro,
        st.cestado,
        st.nnumerotramite,
        st.dfechainiciovigencia,
        st.dfechafinvigencia,
        st.cnumerorecibocaja,
        st.dfechapago,
        std.*
    FROM tsolicitante s
    INNER JOIN tsolicitudtramite st 
        ON s.ccodigosolicitante = st.ccodigosolicitante 
    INNER JOIN (select nidtsolicitudtramitedetalle,nidtsolicitudtramite,ccodigo,nidtmontotramite,ncantidad,cdescripcion,nmontotramite 
				from tsolicitudtramitedetalle where nidtsolicitudtramite=p_nidtsolicitudtramite  union 
                select nidtcomisionbancoaplicacion,nidtsolicitudtramite,'-' as ccodigo,nidtcomisionbanco as nidtmontotramite,1 as ncantidad,cdescripcion,nmontocomision as nmontotramite 
                from tcomisionbancoaplicacion where nidtsolicitudtramite=p_nidtsolicitudtramite  ) std 
        ON st.nidtsolicitudtramite = std.nidtsolicitudtramite	
    WHERE st.nidtsolicitudtramite = p_nidtsolicitudtramite;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_rpt_retornar_solicitud_tramite_por_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_rpt_retornar_solicitud_tramite_por_id`(
    IN p_nidtsolicitudtramite INT
)
BEGIN
    SELECT 
        s.*, 
        st.dfechapeticion,
        st.dfecharegistro,
        st.cestado,
        st.nnumerotramite,
        st.dfechainiciovigencia,
        st.dfechafinvigencia,
        std.*
    FROM tsolicitante s
    INNER JOIN tsolicitudtramite st 
        ON s.ccodigosolicitante = st.ccodigosolicitante 
    INNER JOIN (select nidtsolicitudtramitedetalle,nidtsolicitudtramite,ccodigo,nidtmontotramite,ncantidad,cdescripcion,nmontotramite 
				from tsolicitudtramitedetalle where nidtsolicitudtramite=p_nidtsolicitudtramite  union 
                select nidtcomisionbancoaplicacion,nidtsolicitudtramite,'-' as ccodigo,nidtcomisionbanco as nidtmontotramite,1 as ncantidad,cdescripcion,nmontocomision as nmontotramite 
                from tcomisionbancoaplicacion where nidtsolicitudtramite=p_nidtsolicitudtramite  ) std 
        ON st.nidtsolicitudtramite = std.nidtsolicitudtramite	
    WHERE st.nidtsolicitudtramite = p_nidtsolicitudtramite;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_activar_desactivar_tespecificatramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_activar_desactivar_tespecificatramite`(      
    pccodigoespecifica varchar(20),
    pccodigo varchar(20),
    opcion varchar(1)
)
BEGIN	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS ncodigo, 'ERROR' AS cestado, 'Error en la transacción' AS cmensaje;
    END;

    START TRANSACTION;

    IF opcion = 'I' THEN
        IF EXISTS (
            SELECT * FROM tespecificatramite
            WHERE ccodigoespecifica = pccodigoespecifica AND ccodigo = pccodigo
        ) THEN
            UPDATE tespecificatramite
            SET bvigente = NOT bvigente, dfechafin = NULL
            WHERE ccodigoespecifica = pccodigoespecifica AND ccodigo = pccodigo;
        ELSE
            INSERT INTO tespecificatramite(ccodigoespecifica, ccodigo, dfechainicio, bvigente)
            VALUES(pccodigoespecifica, pccodigo, NOW(), TRUE);
        END IF;
    ELSE
        UPDATE tespecificatramite
        SET bvigente = NOT bvigente, dfechafin = NOW()
        WHERE ccodigoespecifica = pccodigoespecifica AND ccodigo = pccodigo;
    END IF;

    COMMIT;
    SELECT 1 AS ncodigo, 'CORRECTO' AS cestado, 'ACTUALIZADO' AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_agregar_solicitud_tramite_recibo_ingreso` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_agregar_solicitud_tramite_recibo_ingreso`(pnidtsolicitudtramite long,pnidtreciboingreso int)
BEGIN
    -- Declaración de variables para el retorno
    DECLARE v_ncodigo INT DEFAULT pnidtsolicitudtramite;
    DECLARE v_cestado VARCHAR(20);
    DECLARE v_cmensaje VARCHAR(255);
     DECLARE code CHAR(5) DEFAULT '00000';
    DECLARE msg TEXT;
    DECLARE errno INT;
    
     DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 
            code = RETURNED_SQLSTATE, 
            errno = MYSQL_ERRNO,
            msg = MESSAGE_TEXT;
            
        ROLLBACK;
        SET v_cestado = 'error';
        -- Concatenamos el error real de MySQL al mensaje
        SET v_cmensaje = CONCAT('Error ', errno, ' (', code, '): ', msg);
        SELECT v_ncodigo AS ncodigo, v_cestado AS cestado, v_cmensaje AS cmensaje;
    END;

    START TRANSACTION;
        -- Ejecutamos el delete corregido	
        insert into treciboingresodetalle(nidtreciboingreso,nidtsolicitudtramitedetalle,ccodigoespecifica,ccodigo,nmontotramite,ctransaccion)
        select pnidtreciboingreso,nidtsolicitudtramitedetalle,ccodigoespecifica,std.ccodigo,nmontotramite,'NOTA DE ABONO'
        from tsolicitudtramitedetalle std inner join tespecificatramite et
        on std.ccodigo=et.ccodigo and nidtsolicitudtramite=pnidtsolicitudtramite;        
		
        update tsolicitudtramite set cestado='CERRADO'
        where nidtsolicitudtramite = pnidtsolicitudtramite;
        -- Si llega aquí, todo salió bien
        COMMIT;
        SET v_cestado = 'correcto';
        SET v_cmensaje = 'Registro guardado exitosamente';
        
    SELECT v_ncodigo AS ncodigo, v_cestado AS cestado, v_cmensaje AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_anular_solicitud_tramite_vencido` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_anular_solicitud_tramite_vencido`()
BEGIN	
   update tsolicitudtramite set cestado='ANULADO' 
   where cestado='SOLICITADO' and now() >dfechafinvigencia;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_anular_tsolicitudtramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_anular_tsolicitudtramite`(
    IN p_nidtsolicitudtramite int
)
BEGIN
    set @ncodigo=-1;
    set @cestado='ERROR';
    set @cmensaje='No existe la solicitud para anular';
	SELECT -1 AS ncodigo, 'ERROR' AS cestado, 'No existe la solicitud' AS cmensaje;
	if exists(select  1 from tsolicitudtramite where nidtsolicitudtramite=p_nidtsolicitudtramite)then
		update tsolicitudtramite set cestado='ANULADO'
		where nidtsolicitudtramite=p_nidtsolicitudtramite;
		set @ncodigo=0;
		set @cestado='CORRECTO';
		set @cmensaje='Se anuló el registro';        
	end if;
    select @ncodigo,@cestado,@cmensaje;    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_consistencia_recibo_caja` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_consistencia_recibo_caja`(
    IN p_fechapago datetime
)
BEGIN  
	-- Borramos si ya existe
	DROP TEMPORARY TABLE IF EXISTS tmp1;

-- Inicializamos el índice
	SET @indice := 0;

-- Creamos la tabla y cargamos los datos en un solo paso
	CREATE TEMPORARY TABLE tmp1 AS
	SELECT 
		(@indice := @indice + 1) AS nro_item, 
		t.* FROM tsolicitudtramite t 
	WHERE DATE(t.dfechapago) = p_fechapago;
	
    select count(*) 
	into @registros
	from tmp1;
	
	set @indice=1;
	select convert(substring(max(cnumerorecibocaja),6,7) , unsigned int) 
	into @numero
	from tsolicitudtramite;
	
	while (@indice<=@registros) do
		set @numero=@numero+1;
		set @cnumerorecibocaja=concat(year(now()),'-',LPAD(@numero, 7, '0'));
        select nidtsolicitudtramite 
        into @nidtsolicitudtramite
        from tmp1 where nro_item=@indice;
        update tsolicitudtramite set cnumerorecibocaja=@cnumerorecibocaja
        where nidtsolicitudtramite=@nidtsolicitudtramite;
        set @indice=@indice+1;
	end while;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_consultar_ingreso_recibo_solicitud_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_consultar_ingreso_recibo_solicitud_tramite`(
    IN p_nidtsolicitudtramite INT,
    IN p_cidtsolicitudtramite varchar(10)
)
BEGIN 
	select *
    from tsolicitudtramite  
    where cidtsolicitudtramite=p_cidtsolicitudtramite COLLATE utf8mb4_unicode_ci ;    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_consultar_solicitud_solicitante_hoy` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_consultar_solicitud_solicitante_hoy`(p_ccodigosolicitante varchar(10),p_cestado varchar(20))
BEGIN 
    select * from tsolicitudtramite where now() between date_add(date(dfechapeticion),interval -450 minute) and date_add(date(dfechapeticion),interval 990 minute)
    and cestado=p_cestado and ccodigosolicitante=p_ccodigosolicitante;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_desactivar_tmontotramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_desactivar_tmontotramite`(      
    pnidtmontotramite INT,    
    pdfechafin DATETIME
)
BEGIN    
    DECLARE v_error_message VARCHAR(200);     
    DECLARE vnidtmontotramite_salida INT DEFAULT pnidtmontotramite; 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN        
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        ROLLBACK;
        SELECT -1 AS ncodigo, "ERROR" AS cestado, v_error_message AS cmensaje;
    END;    

    START TRANSACTION;     
		UPDATE tmontotramite set dfechafin=pdfechafin
		WHERE nidtmontotramite = pnidtmontotramite;							        
        SET vnidtmontotramite_salida = pnidtmontotramite;    
    COMMIT;      
    SELECT 
        vnidtmontotramite_salida AS ncodigo,
        "CORRECTO" AS cestado,
        'SE EJECUTÓ LA TRANSACCIÓN CORRECTAMENTE' AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_generar_fines_semana` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_generar_fines_semana`(IN p_anio INT)
BEGIN
    DECLARE v_fecha_inicio DATE;
    DECLARE v_fecha_fin DATE;
    DECLARE v_fecha_actual DATE;
    DECLARE v_ncodigo INT DEFAULT 0;

    
    SET v_fecha_inicio = STR_TO_DATE(CONCAT(p_anio, '-01-01'), '%Y-%m-%d');
    SET v_fecha_fin = STR_TO_DATE(CONCAT(p_anio, '-12-31'), '%Y-%m-%d');
    SET v_fecha_actual = v_fecha_inicio;

    START TRANSACTION;

    WHILE v_fecha_actual <= v_fecha_fin DO
        
        IF DAYOFWEEK(v_fecha_actual) = 1 OR DAYOFWEEK(v_fecha_actual) = 7 THEN
            
            INSERT IGNORE INTO tferiado (dfecha, cdescripcion, brecurrente)
            VALUES (v_fecha_actual, 
                    IF(DAYOFWEEK(v_fecha_actual) = 1, 'DOMINGO', 'SÁBADO'), 
                    TRUE);
            SET v_ncodigo = v_ncodigo + 1;
        END IF;
        
        SET v_fecha_actual = DATE_ADD(v_fecha_actual, INTERVAL 1 DAY);
    END WHILE;

    COMMIT;
    
    SELECT v_ncodigo AS ncodigo, 'CORRECTO' AS cestado, CONCAT('Se registraron ', v_ncodigo, ' días de fin de semana.') AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_generar_token` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_generar_token`(
	pcusuario varchar(20)
)
BEGIN	
    declare nidtsesion bigint;
    declare pcidtsesion varchar(18);
    set nidtsesion=(select round( rand()*(999999999999999999-100000000000000000))+100000000000000000);
    set pcidtsesion=cast(nidtsesion as char);    
    
    select aes_encrypt(pcidtsesion,pcusuario) ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_iniciar_sesion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_iniciar_sesion`(      
	pclogin varchar(20),
    pcontrasenia varchar(200)
)
BEGIN	
	select u.* 
    from tusuario u inner join  tlogin l 
    on u.cidtusuario=l.cidtusuario
	where clogin=pclogin and ccontrasenia=pccontrasenia 
    and now() between dfechainicio and dfechafin;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_catalogo_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_catalogo_tramite`()
BEGIN	
    select * from tcatalogotramite;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_catalogo_tramite_publico` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_catalogo_tramite_publico`()
BEGIN
    select  Row_number() over (order by ct.ccodigo) as nnumerofila,ct.ccodigo,ct.cdenominaciontramite,ct.cdescripcion,btienemontofijo,ifnull(nidtmontotramite,-1) as nidtmontotramite,
    ifnull(nmonto,-1) as nmonto,case btienemontofijo when true then ifnull(cdescripcionpago,'')
                                                               else 'Se debe ingresar de manera manual' end   as cdescripcionpago,
    ifnull(dfechainicio,'1900-01-01') as dfechainicio,ifnull(dfechafin,'1900-01-01') as dfechafin,
    ifnull(nidtdetalletramite,-1) as nidtdetalletramite, 
    ifnull(cdenominaciondetalle,'') as cdenominaciondetalle, 
    ifnull(cvalordetalle,'') as cvalordetalle 
    from tcatalogotramite ct
    left outer join (select * from tmontotramite where dfechafin is null ) mt
    on ct.ccodigo=mt.ccodigo
    left outer  join tdetalletramite dt
    on ct.ccodigo=dt.ccodigo 
    where ct.btienemontofijo = true;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_cuentas_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_cuentas_usuario`(pcidtusuario varchar(20))
BEGIN 
select clogin,cidtusuario,l.nidtperfil,dfechainicio,dfechafin,'' as ccontrasenia,cdescripcionperfil 
from tlogin l inner join tperfil p 
on l.nidtperfil=p.nidtperfil
where cidtusuario=pcidtusuario collate utf8mb4_unicode_ci;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_detalles_solicitudes_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_detalles_solicitudes_tramite`(pcestado varchar(10),pnidttiporeciboingreso int)
BEGIN
	drop table if exists temp_tespecifica;
	CREATE TEMPORARY TABLE temp_tespecifica AS
	SELECT t1.ccodigo
	FROM tespecifica e inner join (select * from tespecificatramite where bvigente=true) t1
    on e.ccodigoespecifica=t1.ccodigoespecifica
	WHERE nidtiporeciboingreso = pnidttiporeciboingreso;
    
    select sol.*,stde.*,st.dfechapago from tsolicitudtramite st inner join tsolicitante sol 
    on st.ccodigosolicitante=sol.ccodigosolicitante
    inner join tsolicitudtramitedetalle stde
    on st.nidtsolicitudtramite=stde.nidtsolicitudtramite
    inner join temp_tespecifica tmp 
    on tmp.ccodigo=stde.ccodigo
    where cestado=pcestado COLLATE utf8mb4_unicode_ci;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_detalles_solicitudes_tramite_recibo_ingreso` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_detalles_solicitudes_tramite_recibo_ingreso`(pnidttiporeciboingreso int)
BEGIN
	drop table if exists temp_tespecifica;
	CREATE TEMPORARY TABLE temp_tespecifica AS
	SELECT t1.ccodigo
	FROM tespecifica e inner join (select * from tespecificatramite where bvigente=true) t1
    on e.ccodigoespecifica=t1.ccodigoespecifica
	WHERE nidtiporeciboingreso = pnidttiporeciboingreso;
    
    select sol.*,stde.*,st.dfechapago 
    from tsolicitudtramite st inner join tsolicitante sol 
    on st.ccodigosolicitante=sol.ccodigosolicitante
    inner join tsolicitudtramitedetalle stde
    on st.nidtsolicitudtramite=stde.nidtsolicitudtramite
    inner join temp_tespecifica tmp 
    on tmp.ccodigo=stde.ccodigo 
    where cestado in ('PAGADO','PAGADO SIN ADJUNTO');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_detalle_configuracion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_detalle_configuracion`(pnidtconfiguracion int)
BEGIN 
    select nidtdetalleconfiguracion,nidtconfiguracion,cdescripciondetalleconfiguracion
    from tdetalleconfiguracion
    where nidtconfiguracion=pnidtconfiguracion;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_detalle_recibo_ingreso` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_detalle_recibo_ingreso`(
	p_nidtreciboingreso int
)
BEGIN
	select rid.*,c.cdenominaciontramite 
	from 
	treciboingresodetalle rid left outer join tcatalogotramite c
	on rid.ccodigo=c.ccodigo
	where nidtreciboingreso=p_nidtreciboingreso;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_detalle_solicitud_tramite_por_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_detalle_solicitud_tramite_por_id`(pnidtsolicitudtramite bigint)
BEGIN
	select std.nidtsolicitudtramitedetalle,
		   std.nidtsolicitudtramite,
           std.ccodigo,
           std.nidtmontotramite,
           std.ncantidad,
           std.cdescripcion,
           std.nmontotramite
	from tsolicitudtramitedetalle std 
	where std.nidtsolicitudtramite=pnidtsolicitudtramite
	union 
	select 0 as nidtsolicitudtramitedetalle,
		   t.nidtsolicitudtramite,
           t.ccodigoespecifica, 
           t.nidtcomisionbancoaplicacion,
           1 as ncantidad,
           t.cdescripcion, 
           nmontocomision as nmontotramite
	from tcomisionbancoaplicacion t
	where t.nidtsolicitudtramite=pnidtsolicitudtramite;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_especifica` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_especifica`()
BEGIN 
    select ccodigoespecifica,nidttipoespecifica,nidtiporeciboingreso,ctipoespecifica,cdescripcionespecifica
    from tespecifica;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_especifica_catalogo_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_especifica_catalogo_tramite`(pccodigoespecifica varchar(20))
BEGIN
    select coalesce(et.bvigente,0)  as seleccionado ,c.ccodigo,c.cdenominaciontramite, '' as cdescripcion 
	from (select * from tespecificatramite where ccodigoespecifica=pccodigoespecifica) et right outer join tcatalogotramite c 
	on et.ccodigo=c.ccodigo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_especifica_tipo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_especifica_tipo`(pnidttipoespecifica int)
BEGIN 
    select ccodigoespecifica,nidttipoespecifica,ctipoespecifica,cdescripcionespecifica
    from tespecifica
    where nidttipoespecifica=pnidttipoespecifica;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_fechas_pago` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_fechas_pago`()
BEGIN
	select distinct date(dfechapago) as dfechapago 
	from tsolicitudtramite where cestado<>'SOLICITADO' and cestado<>'CERRADO' and cestado<>'ANULADO' and cestado<>'EN PROCESO';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_menu_perfil` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_menu_perfil`(pnidtperfil int)
BEGIN 
   drop table if exists tmp;
   create temporary table tmp
   as 
   select * from tmenuperfil 
   where nidtperfil=pnidtperfil;
   select m.nidtmodulo,m.nidtagrupadormodulo,cdescripcionmodulo,ciconomodulo,
          case when tmp.nidtperfil is null then false else true end as bescogido
   from tmodulo m left outer join 
   tmp 
   on m.nidtmodulo=tmp.nidtmodulo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_monto_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_monto_tramite`(pccodigo varchar(20))
BEGIN 
    select nidtmontotramite,ccodigo,nmonto,cdescripcionpago,dfechainicio,dfechafin
    from tmontotramite
    where ccodigo=pccodigo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_perfil` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_perfil`()
BEGIN 
    select nidtperfil,cdescripcionperfil
    from tperfil;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_recibos_ingreso` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_recibos_ingreso`(
    IN p_fecha_inicio DATETIME,
    IN p_fecha_fin DATETIME 
)
BEGIN
    SELECT 
        r.nidtreciboingreso,
        r.nnrorecibo,
        r.nanio,
        r.nidtiporeciboingreso,
        r.clogin,
        r.dfecharecibo,
        r.cnumerosiaf,
        r.dfecharegistro, 
        r.cobservacion,
        r.cnotapago,
        r.cexpedientesiaf,
        r.cordenservicio,
        r.cruc,
        r.cproveedor,
        r.cfactura,
        r.cguiaremision,
        r.crubro,
        r.ccorrelativocut,
        r.ctiporubro,
        tr.*        
    FROM treciboingreso r inner join ttiporeciboingreso tr
    on r.nidtiporeciboingreso=tr.nidtiporeciboingreso
    WHERE date(r.dfecharecibo) BETWEEN date(p_fecha_inicio) AND date(p_fecha_fin)
    ORDER BY r.dfecharecibo ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_requisito_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_requisito_tramite`(pccodigo varchar(20))
BEGIN
    select * from trequisitotramite where ccodigo=pccodigo ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_solicitudes_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_solicitudes_tramite`(pcestado varchar(10))
BEGIN
    select sol.*,st.* from tsolicitudtramite st inner join tsolicitante sol 
    on st.ccodigosolicitante=sol.ccodigosolicitante
    where cestado=pcestado COLLATE utf8mb4_unicode_ci ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_tagrupadormodulo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_tagrupadormodulo`()
BEGIN 
    select nidtagrupadormodulo,cdescripcionagrupador,ciconoagrupador
    from tagrupadormodulo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_tdetalle_configuracion_x_codigo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_tdetalle_configuracion_x_codigo`(pnidtconfiguracion int)
BEGIN 
    select * from tdetalleconfiguracion where nidtconfiguracion=pnidtconfiguracion;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_tiporeciboingreso` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_tiporeciboingreso`()
BEGIN
    
    SELECT 
        nidtiporeciboingreso,
        cdescripcion,
        cfuentefinanciamiento,
        crubro,
        ctiporecurso,
        ctipooperacion,
        ccuentabanco
    FROM ttiporeciboingreso;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_tmodulo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_tmodulo`()
BEGIN
    select nidtmodulo,nidtagrupadormodulo,cdescripcionmodulo,ciconomodulo,crutamodulo 
    from tmodulo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_tramite_especifica_monto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_tramite_especifica_monto`()
BEGIN
    select mt.ccodigo,cdescripcionpago,ccodigoespecifica,nidtmontotramite,nmonto 
    from 
    tespecificatramite et inner join 
	tmontotramite mt
	on et.ccodigo=mt.ccodigo
    where et.bvigente=1 and mt.dfechafin is null;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_tsolicitudes_para_banco` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_tsolicitudes_para_banco`()
begin
	SELECT st.ccodigosolicitante,st.cnumerodocumento,st.cnombres,st.capellidopaterno,st.capellidomaterno,
    s.nidtsolicitudtramite,s.ccodigosolicitante,s.nidttiposolicitante,s.dfechapeticion,s.dfecharegistro,
    s.ccomprobantepath,s.cnumerotransaccion,s.dfechatransaccion,s.dhoratransaccion,s.cestado,s.cidtsolicitudtramite,sum(sd.nmontotramite) as nmontotramite,cba.nmontocomision
	FROM tsolicitante st inner join tsolicitudtramite s
	on st.ccodigosolicitante=s.ccodigosolicitante
    inner join tsolicitudtramitedetalle sd
    on s.nidtsolicitudtramite=sd.nidtsolicitudtramite
    inner join tcomisionbancoaplicacion cba
    on s.nidtsolicitudtramite=cba.nidtsolicitudtramite
	WHERE cestado = 'SOLICITADO'
    group by st.ccodigosolicitante,st.cnumerodocumento,st.cnombres,st.capellidopaterno,st.capellidomaterno,
    s.nidtsolicitudtramite,s.ccodigosolicitante,s.nidttiposolicitante,s.dfechapeticion,s.dfecharegistro,
    s.ccomprobantepath,s.cnumerotransaccion,s.dfechatransaccion,s.dhoratransaccion,s.cestado,cba.nmontocomision;  
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_tsolicitudtramite_codigo_solicitante` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_tsolicitudtramite_codigo_solicitante`(pccodigosolicitante varchar(10))
BEGIN
    select nidtsolicitudtramite,ccodigosolicitante,nidttiposolicitante,dfechapeticion,dfecharegistro,
    '' as ccomprobantepath,
    '' as cnumerotransaccion,
    null as dfechatransaccion,
    null as dhoratransaccion,
    cestado,
    '' as cidtsolicitudtramite,
    nnumerotramite,
    dfechainiciovigencia,
    dfechafinvigencia,
    null as dfechasubidoarchivo,
    dfechapago,
    cnumerorecibocaja
    from tsolicitudtramite where ccodigosolicitante=(pccodigosolicitante COLLATE utf8mb4_unicode_ci);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_tsolicitudtramite_codigo_solicitante_estado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_tsolicitudtramite_codigo_solicitante_estado`(pccodigosolicitante varchar(10),pcestado varchar(20))
BEGIN
    select nidtsolicitudtramite,ccodigosolicitante,nidttiposolicitante,dfechapeticion,dfecharegistro,
    '' as ccomprobantepath,
    '' as cnumerotransaccion,
    null as dfechatransaccion,
    null as dhoratransaccion,
    cestado, 
    '' as cidtsolicitudtramite,
    nnumerotramite,
    dfechainiciovigencia,
    dfechafinvigencia,
    null as dfechasubidoarchivo,
    dfechapago,
    cnumerorecibocaja
    from tsolicitudtramite where ccodigosolicitante=(pccodigosolicitante COLLATE utf8mb4_unicode_ci) and cestado=(pcestado COLLATE utf8mb4_unicode_ci);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_unidad_organizativa` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_unidad_organizativa`()
BEGIN 
    select nidtunidadorganizativa,cnombreunidadorganizativa 
    from tunidadorganizativa;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_listar_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_listar_usuario`()
BEGIN 
    select cidtusuario,nidttipousuario,cdni,ccodigo,cnombres,cpaterno,cmaterno,ccorreo,dfechanacimiento,ctelefono
    from tusuario;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_feriado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_feriado`(    
    IN p_id INT,
    IN p_fecha DATE,
    IN p_descripcion VARCHAR(100),
    IN p_recurrente BOOLEAN,
    IN p_opcion VARCHAR(1)
)
BEGIN
    
    DECLARE v_ncodigo INT DEFAULT 1;
    DECLARE v_cestado VARCHAR(10) DEFAULT 'CORRECTO';
    DECLARE v_cmensaje VARCHAR(255) DEFAULT 'Registro realizado';
    
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_cmensaje = MESSAGE_TEXT;
        ROLLBACK;
        SELECT -1 AS ncodigo, 'ERROR' AS cestado, CONCAT('Error: ', v_cmensaje) AS cmensaje;
    END;

    START TRANSACTION;
    IF p_opcion = 'I' THEN
        INSERT INTO tferiado (dfecha, cdescripcion, brecurrente)
        VALUES (p_fecha, p_descripcion, p_recurrente);        
    ELSEIF p_opcion = 'U' THEN
        UPDATE tferiado 
        SET dfecha = p_fecha, 
            cdescripcion = p_descripcion, 
            brecurrente = p_recurrente
        WHERE nidtferidado = p_id;        
    ELSEIF p_opcion = 'D' THEN
        DELETE FROM tferiado WHERE nidtferidado = p_id;
        SET v_cmensaje = 'Registro eliminado';        
    ELSE
        SET v_ncodigo = -1;
        SET v_cestado = 'ERROR';
        SET v_cmensaje = 'Opción no válida';
    END IF;
    COMMIT;
    
    SELECT v_ncodigo AS ncodigo, v_cestado AS cestado, v_cmensaje AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tagrupadormodulo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tagrupadormodulo`(      
	pnidtagrupadormodulo int,
    pcdescripcionagrupador varchar(50),    
    pciconoagrupador varchar(45),
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tagrupadormodulo(cdescripcionagrupador,ciconoagrupador) 
        VALUES (pcdescripcionagrupador,pciconoagrupador); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update tagrupadormodulo set cdescripcionagrupador=pcdescripcionagrupador,
									ciconoagrupador=pciconoagrupador
        where nidtagrupadormodulo=pnidtagrupadormodulo;
	    select pnidtagrupadormodulo as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tagrupadormodulo where nidtagrupadormodulo=pnidtagrupadormodulo;
          select pnidtperfil as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tcatalogotramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tcatalogotramite`(      
	pccodigo varchar(20),
    pcdenominaciontramite varchar(200),    
    pcdescripcion varchar(1000),
    pccodigobanco varchar(10),
    pbtienemontofijo bit,
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tcatalogotramite(ccodigo,cdenominaciontramite,cdescripcion,ccodigobanco,btienemontofijo) 
        VALUES (pccodigo,pcdenominaciontramite,pcdescripcion,pccodigobanco,pbtienemontofijo); 
	    select count(*) as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje
        from tcatalogotramite;
	end if;  
    if(opcion='U') THEN	
	    update tcatalogotramite set cdenominaciontramite=pcdenominaciontramite,
									cdescripcion=pcdescripcion,
                                    ccodigobanco=pccodigobanco,
                                    btienemontofijo=pbtienemontofijo
        where ccodigo=pccodigo;
	    select 1 as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tcatalogotramite where ccodigo=pccodigo;
          select 1 as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tconfiguracion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tconfiguracion`(      
	pnidtconfiguracion int,
    pcdescripcion varchar(100),        
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tconfiguracion(cdescripcion) 
        VALUES (pcdescripcion); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update tconfiguracion set cdescripcion=pcdescripcion
        where nidtconfiguracion=pnidtconfiguracion;
	    select pnidtconfiguracion as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tconfiguracion where nidtconfiguracion=pnidtconfiguracion;
          select pnidtconfiguracion as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tdetalletramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tdetalletramite`(
	pnidtdetalletramite int,
    pccodigo varchar(20),
    pcdenominaciondetalle varchar(300),
    pcvalordetalle varchar(300),
	opcion varchar(1)
)
BEGIN
    if(opcion='I') THEN	
	    INSERT INTO tdetalletramite(ccodigo,cdenominaciondetalle,cvalordetalle) 
        VALUES ( pccodigo,pcdenominaciondetalle,pcvalordetalle); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update tdetalletramite set ccodigo=pccodgio,
								 nmonto=pnmonto,
                                 cdenominaciondetalle=pcdenominaciondetalle,
                                 cvalordetalle=pcvalordetalle      
        where nidtdetalletramite=pnidtdetalletramite;
	    select pnidtdetalletramite as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tdetalletramite where nidtdetalletramite=pnidtdetalletramite;
          select pnidtdetalletramite as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tdetalle_configuracion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tdetalle_configuracion`(      
	pnidtdetalleconfiguracion int,
    pnidtconfiguracion int,    
    pcdescripciondetalleconfiguracion varchar(200),
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tdetalleconfiguracion(nidtconfiguracion,cdescripciondetalleconfiguracion) 
        VALUES (pnidtconfiguracion,pcdescripciondetalleconfiguracion); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if(opcion='U') THEN	
	    update tdetalleconfiguracion set nidtconfiguracion=pnidtconfiguracion
        where nidtdetalleconfiguracion=pnidtdetalleconfiguracion;
	    select pnidtdetalleconfiguracion as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tdetalleconfiguracion where nidtdetalleconfiguracion=pnidtdetalleconfiguracion;
          select pnidtdetalleconfiguracion as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tespecifica` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tespecifica`(
	pccodigoespecifica varchar(20),
    pnidttipoespecifica int,
    pnidtiporeciboingreso int,
    pctipoespecifica varchar(50),
    pcdescripcionespecifica varchar(200),
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tespecifica(ccodigoespecifica,nidttipoespecifica,nidtiporeciboingreso,ctipoespecifica,cdescripcionespecifica)
        VALUES ( pccodigoespecifica,pnidttipoespecifica,pnidtiporeciboingreso,pctipoespecifica,pcdescripcionespecifica); 
	    select 1 as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN
	    update tespecifica set nidttipoespecifica=pnidttipoespecifica,
						  ctipoespecifica=pctipoespecifica,
                          nidtiporeciboingreso=pnidtiporeciboingreso,
                          cdescripcionespecifica=pcdescripcionespecifica
        where ccodigoespecifica=pccodigoespecifica;
	    select 1 as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tespecifica where ccodigoespecifica=pccodigoespecifica;
          select 1 as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tespecificatramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tespecificatramite`(      
    pccodigoespecifica varchar(20),
    pccodigo varchar(20),
    pdfechainicio datetime,
	opcion varchar(1)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL SET MESSAGE_TEXT = 'Error en la transacción';
        SELECT -1 AS ncodigo, "ERROR" AS cestado, MESSAGE_TEXT as cmensaje;
    END;	
     START TRANSACTION; 
    if(opcion='I') THEN	
	    INSERT INTO tespecificatramite(ccodigoespecifica,ccodigo,dfechainicio) 
        VALUES (pccodigoespecifica,pccodigo,pdfechainicio);	    
	end if;      
    if (opcion='D') THEN
          DELETE from tespecificatramite where ccodigoespecifica=pccodigoespecifica and ccodigo=pccodigo;          
    END IF;
    COMMIT;    
    select 1 as ncodigo,"CORRECTO" as cestado,'SE EJECUTO LA TRANSACCION' AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tlogin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tlogin`(
	pclogin varchar(20),
    pcidtusuario varchar(10),
    pnidtperfil int,
    pdfechainicio datetime,        
    pdfechafin datetime,
    pccontrasenia varchar(200),
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tlogin(clogin,cidtusuario,nidtperfil,dfechainicio,dfechafin,ccontrasenia) 
        VALUES (pclogin,pcidtusuario,pnidtperfil,pdfechainicio,pdfechafin,pccontrasenia); 
	    select 1 as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update tlogin set cidtusuario=pcidtusuario,
						  nidtperfil=pnidtperfil,
                          dfechainicio=pdfechainicio,
                          dfechafin=pdfechafin,
                          ccontrasenia=pccontrasenia
        where clogin=pclogin;
	    select 1 as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tlogin where clogin=pclogin;
          select 1 as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tmenuperfil` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tmenuperfil`(
	pnidtmenuperfil int,
    pnidtmodulo int,
    pnidtperfil int,
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tmenuperfil(nidtmodulo,nidtperfil) 
        VALUES ( pnidtmodulo,pnidtperfil); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update tmenuperfil set nidtmodulo=pnidtmodulo,
						  nidtperfil=pnidtperfil
        where nidtmenuperfil=pnidtmenuperfil;
	    select pnidtmenuperfil as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tmenuperfil where nidtmenuperfil=pnidtmenuperfil;
          select pnidtmenuperfil as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tmodulo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tmodulo`(
pnidtmodulo int,
    pnidtagrupadormodulo int,
    pcdescripcionmodulo varchar(250),
    pciconomodulo varchar(45),
    pcrutamodulo varchar(200),
opcion varchar(1)
)
BEGIN 
    if(opcion='I') THEN
    INSERT INTO tmodulo(nidtagrupadormodulo,cdescripcionmodulo,ciconomodulo,crutamodulo) 
        VALUES ( pnidtagrupadormodulo,pcdescripcionmodulo,pciconomodulo,pcrutamodulo); 
    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
end if;  
    if(opcion='U') THEN 
    update tmodulo set nidtagrupadormodulo=pnidtagrupadormodulo, 
   cdescripcionmodulo=pcdescripcionmodulo,
                           ciconomodulo=pciconomodulo,
                           crutamodulo=pcrutamodulo 
        where nidtmodulo=pnidtmodulo;
    select pnidtmodulo as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
end if; 
    if (opcion='D') THEN
          DELETE from tmodulo where nidtmodulo=pnidtmodulo;
          select pnidtmodulo as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tmontotramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tmontotramite`(      
    pnidtmontotramite INT,
    pccodigo VARCHAR(20),
    pmonto DECIMAL(10,2),
    pcdescripcionpago VARCHAR(300),
    pdfechainicio DATETIME,
    opcion VARCHAR(1)
)
BEGIN    
    DECLARE v_error_message VARCHAR(200);     
    DECLARE vnidtmontotramite_salida INT DEFAULT pnidtmontotramite; 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN        
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        ROLLBACK;
        SELECT -1 AS ncodigo, "ERROR" AS cestado, v_error_message AS cmensaje;
    END;    

    START TRANSACTION; 
    IF (opcion = 'I') THEN    
        INSERT INTO tmontotramite(ccodigo, nmonto, cdescripcionpago, dfechainicio) 
        VALUES (pccodigo, pmonto, pcdescripcionpago, pdfechainicio);         
        SET vnidtmontotramite_salida = LAST_INSERT_ID();
    END IF;  
    IF (opcion = 'U') THEN
		UPDATE tmontotramite set ccodigo=pccodigo,
								 nmonto=pmonto,
                                 cdescripcionpago=pcdescripcionpago
		WHERE nidtmontotramite = pnidtmontotramite;							        
        SET vnidtmontotramite_salida = pnidtmontotramite;
    END IF;  
    IF (opcion = 'D') THEN
        DELETE FROM tmontotramite WHERE nidtmontotramite = pnidtmontotramite;      
		SET vnidtmontotramite_salida = pnidtmontotramite;
    END IF;
    COMMIT;      
    SELECT 
        vnidtmontotramite_salida AS ncodigo,
        "CORRECTO" AS cestado,
        'SE EJECUTÓ LA TRANSACCIÓN CORRECTAMENTE' AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tperfil` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tperfil`(      
	pnidtperfil int,
    pcdescripcionperfil varchar(100),    
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tperfil(cdescripcionperfil) 
        VALUES (pcdescripcionperfil); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update tperfil set cdescripcionperfil=pcdescripcionperfil
        where nidtperfil=pnidtperfil;
	    select pnidtperfil as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tperfil where nidtperfil=pnidtperfil;
          select pnidtperfil as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_trequisitotramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_trequisitotramite`(      
	pnidtrequistotramite int,
    pccodigo varchar(20),
    pcdescripcionrequisito varchar(400),
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO trequisitotramite(ccodigo,cdescripcionrequisito) 
        VALUES (pccodigo,pcdescripcionrequisito); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update trequisitotramite set ccodigo=pccodigo,
									 cdescripcionrequisito=pcdescripcionrequisito
        where nidtrequisitotramite=pnidtrequistotramite;
	    select pnidtrequistotramite as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from trequisitotramite where nidtrequisitotramite=pnidtrequistotramite;
          select pnidtrequistotramite as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tsolicitudtramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tsolicitudtramite`(
  IN p_ccodigo VARCHAR(20),
  IN p_ccodigosolicitante VARCHAR(10),
  IN p_nidttiposolicitante INT,
  IN p_cdescripcion TEXT, 
  IN p_dfechapeticion DATE, 
  IN p_accion VARCHAR(20), 
  IN p_cnumerodocumento VARCHAR(10),
  IN p_cnombres VARCHAR(30),
  IN p_capellidopaterno VARCHAR(30),
  IN p_capellidomaterno VARCHAR(30),
  in p_ncantidad int
)
BEGIN
  DECLARE v_estado_actual ENUM('SOLICITADO','VALIDADO');
  DECLARE v_id BIGINT;
  DECLARE v_codigo VARCHAR(10);
  DECLARE v_numero INT;

  
  IF GET_LOCK('lock_codigo_solicitante', 10) THEN

    
    IF p_ccodigosolicitante IS NULL OR TRIM(p_ccodigosolicitante) = '' THEN
      SELECT MAX(ccodigosolicitante) INTO v_codigo
      FROM tsolicitante;

      IF v_codigo IS NULL THEN
        SET v_numero = 1;
      ELSE
        SET v_numero = CAST(SUBSTRING(v_codigo, 4) AS UNSIGNED) + 1;
      END IF;

      SET p_ccodigosolicitante = CONCAT('SOL', LPAD(v_numero, 4, '0'));

      INSERT INTO tsolicitante (
        ccodigosolicitante,
        cnumerodocumento,
        cnombres,
        capellidopaterno,
        capellidomaterno
      ) VALUES (
        p_ccodigosolicitante,
        p_cnumerodocumento,
        p_cnombres,
        p_capellidopaterno,
        p_capellidomaterno
      );
    END IF;

    
    IF p_accion = 'REGISTRAR' THEN
      INSERT INTO tsolicitudtramite (
        ccodigo,
        ccodigosolicitante,
        nidttiposolicitante,
        cdescripcion,
        dfechapeticion,
        dfecharegistro,
        cestado,
        ncantidad
      ) VALUES (
        p_ccodigo,
        p_ccodigosolicitante,
        p_nidttiposolicitante,
        p_cdescripcion,
        NOW(),
        NOW(),
        'SOLICITADO',
        p_ncantidad
      );

      SET v_id = LAST_INSERT_ID();

    ELSEIF p_accion = 'VALIDAR' THEN
      SELECT cestado INTO v_estado_actual
      FROM tsolicitudtramite
      WHERE nidtsolicitudtramite = p_ccodigo;

      IF v_estado_actual = 'SOLICITADO' THEN
        UPDATE tsolicitudtramite
        SET cestado = 'VALIDADO'
        WHERE nidtsolicitudtramite = p_ccodigo;
      END IF;

      SET v_id = p_ccodigo;
    END IF;

    
    DO RELEASE_LOCK('lock_codigo_solicitante');

    
    SELECT v_id AS ncodigo, 'CORRECTO' AS cestado, 'REGISTRADO' AS cmensaje;

  ELSE
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'No se pudo obtener el lock para generar código';
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_ttramitesolicitado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_ttramitesolicitado`(      
	pnidttramitesolicitado int,
    pccodigounicotramite varchar(30),
    pccodigo varchar(20),
    pcidtusuario varchar(10),
    pnidtdetalleconfiguracion int,
    pdfechatramite datetime,
    pbactivo bit,
    pnmontopago decimal(10,2),
    pcdescripcionpago varchar(100),
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO ttramitesolicitado(ccodigounicotramite,ccodigo,cidtusuario,nidtdetalleconfiguracion,dfechatramite,bactivo,nmontopago,cdescripcionpago,ndiasvigenciasolicitud) 
        VALUES (pccodigounicotramite,pccodigo,pcidtusuario,pnidtdetalleconfiguracion,pdfechatramite,pbactivo,pnmontopago,pcdescripcionpago,pndiasvigenciasolicitud); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update ttramitesolicitado set ccodigounicotramite=pccodigounicotramite,
									 ccodigo=pccodigo,
									 cidtusuario=pcidtusuario,
                                     nidtdetalleconfiguracion=pnidtdetalleconfiguracion,
                                     dfechatramite=pdfechatramite,
                                     bactivo=pbactivo,
                                     nmontopago=pnmontopago,
                                     cdescripcionpago=pcdescripcionpago,
                                     ndiasvigenciasolicitud=pndiasvigenciasolicitud
        where nidttramitesolicitado=pnidttramitesolicitado;
	    select pnidttramitesolicitado as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from ttramitesolicitado where nidttramitesolicitado=pnidttramitesolicitado;
          select pnidttramitesolicitado as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tunidadorganizativa` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tunidadorganizativa`(      
	pnidtunidadorganizativa int,
    pcnombreunidadorganizativa varchar(250),
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tunidadorganizativa(cnombreunidadorganizativa) 
        VALUES (pcnombreunidadorganizativa); 
	    select last_insert_id() as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update tunidadorganizativa set cnombreunidadorganizativa=pcnombreunidadorganizativa									 
        where nidtunidadorganizativa=pnidtunidadorganizativa;
	    select pnidtunidadorganizativa as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tunidadorganizativa where nidtunidadorganizativa=pnidtunidadorganizativa;
          select pnidtunidadorganizativa as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tunidadtramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tunidadtramite`(      
    pccodigo varchar(20),
    pnidtunidadorganizativa int,
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tunidadtramite(ccodigo,nidtunidadorganizativa) 
        VALUES (pccodigo,pnidtunidadorganizativa);
	    select 1 as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;      
    if (opcion='D') THEN
          DELETE from tunidadtramite where ccodigo=pccodigo and nidtunidadorganizativa=pnidtunidadorganizativa;
          select 1 as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_mantenimiento_tusuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_mantenimiento_tusuario`(      
	pcidtusuario varchar(10),
    pnidttipousuario int,
    pcdni varchar(10),
    pccodigo varchar(20),
    pcnombres varchar(45),
    pcpaterno varchar(45),
    pcmaterno varchar(45),
    pccorreo varchar(45),
    pdfechanacimiento datetime,
    pctelefono varchar(20),
	opcion varchar(1)
)
BEGIN	
    if(opcion='I') THEN	
	    INSERT INTO tusuario(cidtusuario,nidttipousuario,cdni,ccodigo,cnombres,cpaterno,cmaterno,ccorreo,dfechanacimiento,ctelefono) 
        VALUES (pcidtusuario,pnidttipousuario,pcdni,pccodigo,pcnombres,pcpaterno,pcmaterno,pccorreo,pdfechanacimiento,pctelefono); 
	    select 1 as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if;  
    if(opcion='U') THEN	
	    update tusuario set nidttipousuario=pnidttipousuario,
						    cdni=pcdni,
                            ccodigo=pccodigo,
                            cnombres=pcnombres,
                            cpaterno=pcpaterno,
                            cmaterno=pcmaterno,
                            ccorreo=pccorreo,
                            dfechanacimiento=pdfechanacimiento,
                            ctelefono=pctelefono
        where cidtusuario=pcidtusuario;
	    select 1 as ncodigo,"CORRECTO" as cestado,'REGISTRADO' AS cmensaje;
	end if; 
    if (opcion='D') THEN
          DELETE from tusuario where cidtusuario=pcidtusuario;
          select 1 as ncodigo,"CORRECTO" as cestado,'ELIMINADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_menu_perfil` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_menu_perfil`(
	pnidtperfil int
)
begin
	select Row_number() over (order by m.nidtmodulo) as nidtregistro,
		   am.*,m.nidtmodulo,m.cdescripcionmodulo,m.ciconomodulo,m.crutamodulo 
    from tagrupadormodulo am inner
	join tmodulo m
	on am.nidtagrupadormodulo=m.nidtagrupadormodulo
	inner join tmenuperfil mp
	on m.nidtmodulo=mp.nidtmodulo
	where nidtperfil=pnidtperfil
	order by am.nidtagrupadormodulo;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_obtener_intervalo_vigencia` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_obtener_intervalo_vigencia`(
    IN p_dfechasolicitud DATE,
    OUT p_dfechainiciovigencia DATE,
    OUT p_dfechafinvigencia DATE
)
BEGIN
    DECLARE v_bandera BOOLEAN DEFAULT FALSE;
    DECLARE v_dias INT DEFAULT 1;
    DECLARE v_aux_inicio_vigencia DATE;
    DECLARE v_aux_fin_vigencia DATE;
    WHILE v_bandera = FALSE DO
        SET v_aux_inicio_vigencia = DATE_ADD(p_dfechasolicitud, INTERVAL v_dias DAY);        
        
        IF EXISTS(SELECT 1 FROM tferiado WHERE dfecha = v_aux_inicio_vigencia) THEN 
            SET v_dias = v_dias + 1;
        ELSE
            SET v_bandera = TRUE;
        END IF;
    END WHILE;
    SET v_dias=1;
    SET v_aux_fin_vigencia = v_aux_inicio_vigencia;
    WHILE v_dias<=3 DO
		SET v_aux_fin_vigencia = DATE_ADD(v_aux_fin_vigencia, INTERVAL 1 DAY);
        IF NOT EXISTS(SELECT 1 FROM tferiado WHERE dfecha = v_aux_fin_vigencia) THEN 
            SET v_dias = v_dias + 1;		
        END IF;
    END WHILE;
    SET p_dfechainiciovigencia = v_aux_inicio_vigencia;
    SET p_dfechafinvigencia = DATE_ADD(v_aux_fin_vigencia, INTERVAL -1 MINUTE);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_obtener_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_obtener_usuario`(      
	pclogin varchar(20) 
)
BEGIN	
	SELECT clogin, cidtusuario, nidtperfil, dfechainicio, dfechafin, ccontrasenia
    FROM tlogin
    WHERE clogin COLLATE utf8mb4_unicode_ci = pclogin COLLATE utf8mb4_unicode_ci
      AND NOW() BETWEEN dfechainicio AND dfechafin;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_quitar_solicitud_tramite_recibo_ingreso` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_quitar_solicitud_tramite_recibo_ingreso`(IN pnidtsolicitudtramite LONG)
BEGIN
    DECLARE v_ncodigo INT DEFAULT pnidtsolicitudtramite;
    DECLARE v_cestado VARCHAR(20);
    DECLARE v_cmensaje VARCHAR(500); -- Ampliado para detalles técnicos
    DECLARE v_ccodigosolicitante varchar(11);
    
    -- Variables para capturar el error de MySQL
    DECLARE code CHAR(5) DEFAULT '00000';
    DECLARE msg TEXT;
    DECLARE errno INT;

    -- Manejador de errores dinámico
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 
            code = RETURNED_SQLSTATE,
            errno = MYSQL_ERRNO, 
            msg = MESSAGE_TEXT;
            
        ROLLBACK;
        SET v_cestado = 'error';
        -- Concatenamos el error real de MySQL al mensaje
        SET v_cmensaje = CONCAT('Error ', errno, ' (', code, '): ', msg);
        SELECT v_ncodigo AS ncodigo, v_cestado AS cestado, v_cmensaje AS cmensaje;
    END;
	 
     select ccodigosolicitante 
     into v_ccodigosolicitante
     from tsolicitudtramite where nidtsolicitudtramite=pnidtsolicitudtramite;
     
    START TRANSACTION;
        -- 1. Eliminación con JOIN
        DELETE rid 
        FROM treciboingresodetalle rid
        INNER JOIN tsolicitudtramitedetalle std 
            ON rid.nidtsolicitudtramitedetalle = std.nidtsolicitudtramitedetalle
        WHERE std.nidtsolicitudtramite = pnidtsolicitudtramite;
        
        -- 2. Actualización de estado
        -- Nota: Verificamos si la columna es nidtsolicitudtramite o nidtsolicitudtramitede
        UPDATE tsolicitudtramite 
        SET cestado = 'PAGADO'
        WHERE nidtsolicitudtramite = pnidtsolicitudtramite;
		
        if(v_ccodigosolicitante='00000000')then
			delete from tsolicitudtramitedetalle where nidtsolicitudtramite=pnidtsolicitudtramite;
            delete from tsolicitudtramite where nidtsolicitudtramite=pnidtsolicitudtramite;
		else 
			UPDATE tsolicitudtramite 
			SET cestado = 'PAGADO'
			WHERE nidtsolicitudtramite = pnidtsolicitudtramite;
        end if;
        
        COMMIT;
        
        SET v_cestado = 'correcto';
        SET v_cmensaje = 'Registro eliminado y estado actualizado exitosamente';        
        SELECT v_ncodigo AS ncodigo, v_cestado AS cestado, v_cmensaje AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_registrar_pago_solicitud_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_registrar_pago_solicitud_tramite`(
    IN p_cidtsolicitudtramites TEXT,
    IN p_fechapago datetime
)
BEGIN    
    DECLARE v_codigo VARCHAR(6);
    DECLARE v_pos_cidtsolicitudtramite INT;
    DECLARE v_cestado varchar(20);
    DECLARE v_estado_aux varchar(20);
    
    DECLARE v_sqlstate CHAR(5);
    DECLARE v_errno INT;
    DECLARE v_message TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            v_sqlstate = RETURNED_SQLSTATE, 
            v_errno    = MYSQL_ERRNO,
            v_message  = MESSAGE_TEXT;        
        ROLLBACK; 
        SELECT 0 AS ncodigo, 'ERROR' AS cestado, v_message AS cmensaje;
    END;

    START TRANSACTION;
    
    IF p_cidtsolicitudtramites IS NULL OR p_cidtsolicitudtramites = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La lista de códigos está vacía.';
    END IF;
    
    WHILE LENGTH(p_cidtsolicitudtramites) > 0 DO
        SET v_pos_cidtsolicitudtramite = LOCATE('|', p_cidtsolicitudtramites);        

        IF v_pos_cidtsolicitudtramite = 0 THEN
            SET v_codigo = p_cidtsolicitudtramites;
            SET p_cidtsolicitudtramites = '';
        ELSE
            SET v_codigo = SUBSTRING(p_cidtsolicitudtramites, 1, v_pos_cidtsolicitudtramite - 1);
            SET p_cidtsolicitudtramites = SUBSTRING(p_cidtsolicitudtramites, v_pos_cidtsolicitudtramite + 1);
        END IF;
        
        IF v_codigo <> '' THEN
            select cestado,cnumerorecibocaja 
            into v_cestado,@cnumerorecibocaja
            from tsolicitudtramite where cidtsolicitudtramite=v_codigo COLLATE utf8mb4_unicode_ci;
            IF(v_cestado='EN PROCESO' or v_cestado='PAGADO SIN ADJUNTO' ) then
				set v_estado_aux='PAGADO';
			elseif (v_cestado='SOLICITADO' or v_cestado='ANULADO' ) then
				set v_estado_aux='PAGADO SIN ADJUNTO';			
			end if;
			if(@cnumerorecibocaja is null)then
				select CAST(ifnull(substring(max(cnumerorecibocaja), 6, 7),0) as UNSIGNED INT)+1
				into @nnumerorecibocaja
				from tsolicitudtramite
				where year(dfechapago)=year(now());
				select concat(year(now()),'-',LPAD(@nnumerorecibocaja, 7, '0') )
				into @cnumerorecibocaja;
            end if;
			            
            UPDATE tsolicitudtramite 
            SET cestado = v_estado_aux,
                cnumerotransaccion = '', 
                dfechatransaccion = CURDATE(),
                dhoratransaccion = CURTIME(),
                dfechapago=p_fechapago,
                cnumerorecibocaja=@cnumerorecibocaja
            WHERE  cidtsolicitudtramite  = v_codigo COLLATE utf8mb4_unicode_ci
              AND cestado in ('SOLICITADO','EN PROCESO','ANULADO');
              
            IF ROW_COUNT() = 0 THEN                
                SET v_message = CONCAT('Error: El código ', v_codigo, ' no existe o no está en estado SOLICITADO.');
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_message;
            END IF;
        END IF;
    END WHILE;
    COMMIT;
    SELECT 1 AS ncodigo, 'CORRECTO' AS cestado, 'PAGOS REGISTRADOS CORRECTAMENTE' AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_registrar_recibo_ingreso` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_registrar_recibo_ingreso`(
    IN p_nidtiporeciboingreso INT,
    IN p_clogin VARCHAR(20),
    IN p_cnumerosiaf VARCHAR(6),
    IN p_dfecharecibo datetime,
    in p_observacion varchar(500),
    IN p_detalles TEXT
)
BEGIN
    DECLARE v_nidtreciboingreso INT;
    DECLARE v_idtsolicitudtramite INT;
    DECLARE v_id INT;
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_str VARCHAR(20);
    DECLARE v_cnrorecibo VARCHAR(10);
    DECLARE v_canio VARCHAR(4);
    DECLARE v_max INT;
    DECLARE v_sqlstate CHAR(5);
    DECLARE v_errno INT;
    DECLARE v_message TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            v_sqlstate = RETURNED_SQLSTATE,
            v_errno    = MYSQL_ERRNO,
            v_message  = MESSAGE_TEXT;
        
        ROLLBACK; 
        SELECT 0 AS ncodigo, 'ERROR' AS cestado, v_message AS cmensaje;      
    END;

    START TRANSACTION;    
    SET v_canio = YEAR(CURDATE());    
    SELECT IFNULL(MAX(nnrorecibo), 0) + 1
    INTO v_max 
    FROM treciboingreso
    WHERE nanio = v_canio;
    SET v_cnrorecibo = LPAD(v_max, 6, '0');     
    INSERT INTO treciboingreso (
        nnrorecibo, nanio, nidtiporeciboingreso, clogin,
        dfecharecibo, cnumerosiaf, dfecharegistro,cobservacion
    ) VALUES ( 
        v_cnrorecibo, v_canio, p_nidtiporeciboingreso, p_clogin,
       p_dfecharecibo, p_cnumerosiaf, NOW(),p_observacion
    );
    SET v_nidtreciboingreso = LAST_INSERT_ID();
    WHILE LENGTH(p_detalles) > 0 DO
        SET v_pos = LOCATE('|', p_detalles);
        IF v_pos = 0 THEN
            SET v_str = p_detalles;
            SET p_detalles = '';
        ELSE
            SET v_str = SUBSTRING(p_detalles, 1, v_pos - 1);
            SET p_detalles = SUBSTRING(p_detalles, v_pos + 1);
        END IF;
        SET v_id = CAST(v_str AS UNSIGNED);        
        select nidtsolicitudtramite 
        into v_idtsolicitudtramite
        from tsolicitudtramitedetalle 
        where nidtsolicitudtramitedetalle=v_id;        
        update tsolicitudtramite set cestado='CERRADO'        
        where nidtsolicitudtramite=v_idtsolicitudtramite;        
        INSERT INTO treciboingresodetalle (
            nidtreciboingreso, nidtsolicitudtramitedetalle,
            ccodigoespecifica, ccodigo, nmontotramite, ctransaccion
        )
        SELECT
            v_nidtreciboingreso,
            t.nidtsolicitudtramitedetalle,
            te.ccodigoespecifica,
            t.ccodigo,
            t.nmontotramite,
            'NOTA DE ABONO'
        FROM tsolicitudtramitedetalle t inner join 
        (select ccodigoespecifica,ccodigo from tespecificatramite where bvigente=true) te 
        on t.ccodigo=te.ccodigo
        WHERE t.nidtsolicitudtramitedetalle = v_id;
    END WHILE;
    COMMIT;    
    SELECT v_nidtreciboingreso AS ncodigo, 'CORRECTO' AS cestado,
           CONCAT('REGISTRADO CON NRO ', v_cnrorecibo, ' - ', v_canio) AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_registrar_recibo_ingreso_detalle_manual` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tupa_sp_registrar_recibo_ingreso_detalle_manual`(
    IN p_nidtreciboingreso INT,
    IN p_cnumerodocumento VARCHAR(11),
    IN p_cnombres varchar(30),
    IN p_cpaterno varchar(30),
    IN p_cmaterno varchar(30),
    IN p_nidttiposolicitante INT,
    IN p_ccodigo VARCHAR(20),
    IN p_nidtmontotramite INT,
    IN p_ncantidad INT,    
    IN p_cdescripcion TEXT,
    IN p_nmontotramite DECIMAL(10,2),
    IN p_dfechapago datetime
)
BEGIN
	DECLARE v_id_solicitud BIGINT;
    DECLARE v_id_detalle_solicitud INT;
    DECLARE v_ccodigoespecifica VARCHAR(20);
    DECLARE p_ccodigosolicitante varchar(11);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @p2 = MESSAGE_TEXT;
        ROLLBACK;
        SELECT 0 AS ncodigo, 'ERROR' AS cestado, CONCAT('FALLA: ', @p2) AS cmensaje;
    END;

    START TRANSACTION;                
        SELECT ccodigoespecifica INTO v_ccodigoespecifica
        FROM tespecificatramite
        WHERE ccodigo = p_ccodigo
        ORDER BY bvigente DESC 
        LIMIT 1;        
        IF v_ccodigoespecifica IS NULL THEN
            ROLLBACK;
            SELECT 0 AS ncodigo, 'ERROR' AS cestado, 'NO SE ENCONTRÓ CÓDIGO ESPECIFICA PARA EL TRÁMITE' AS cmensaje;
        ELSE
        
        IF NOT EXISTS (SELECT 1 FROM tsolicitante WHERE cnumerodocumento = p_cnumerodocumento  COLLATE utf8mb4_0900_ai_ci) THEN
			INSERT INTO tsolicitante (ccodigosolicitante,cnumerodocumento, cnombres,capellidopaterno,capellidomaterno)
			VALUES (p_cnumerodocumento,p_cnumerodocumento, p_cnombres,p_cpaterno,p_cmaterno);
            set p_ccodigosolicitante=p_cnumerodocumento;
		else 
			select ccodigosolicitante 
            into p_ccodigosolicitante
            from tsolicitante 
            WHERE cnumerodocumento = p_cnumerodocumento  COLLATE utf8mb4_0900_ai_ci
            limit 1;
		END IF;            
            INSERT INTO tsolicitudtramite (
                ccodigosolicitante,
                nidttiposolicitante,
                dfechapeticion,
                dfecharegistro,
                cestado,
                dfechapago
            ) VALUES (
                p_ccodigosolicitante,
                p_nidttiposolicitante,
                p_dfechapago,
                NOW(),
                'CERRADO' ,
                p_dfechapago
            );            
            SET v_id_solicitud = LAST_INSERT_ID();            
            INSERT INTO tsolicitudtramitedetalle (
                nidtsolicitudtramite,
                ccodigo,
                nidtmontotramite,
                ncantidad,
                cdescripcion,
                nmontotramite
            ) VALUES (
                v_id_solicitud,
                p_ccodigo,
                p_nidtmontotramite,
                p_ncantidad,
                p_cdescripcion,
                p_nmontotramite
            );
            SET v_id_detalle_solicitud = LAST_INSERT_ID();            
            INSERT INTO treciboingresodetalle (
                nidtreciboingreso,
                nidtsolicitudtramitedetalle,
                ccodigoespecifica,
                ccodigo,
                nmontotramite,
                ctransaccion
            ) VALUES (
                p_nidtreciboingreso,
                v_id_detalle_solicitud,
                v_ccodigoespecifica,
                p_ccodigo,
                p_nmontotramite,
                'NOTA ABONO' 
            );            
            COMMIT;
            SELECT 1 AS ncodigo, 'CORRECTO' AS cestado, 'REGISTRADO' AS cmensaje;
        END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_registrar_recibo_ingreso_manual` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tupa_sp_registrar_recibo_ingreso_manual`(
	IN p_nidtreciboingreso int,
    IN p_nidtiporeciboingreso INT,
    in p_nnumerorecibo int,
    IN p_clogin VARCHAR(20),
    IN p_dfecharecibo DATETIME,
    IN p_cnumerosiaf VARCHAR(6),
    IN p_cobservacion VARCHAR(500),
    in p_cnota_pago varchar(30),
    in p_cexpedientesiaf varchar(30),
    in p_cordenservicio varchar(30),
    in p_cruc varchar(30),
    in p_cproveedor varchar(100),
    in p_cfactura varchar(40),
    in p_cguiaremision varchar(40),
    in p_crubro varchar(40),
    in p_ccorrelativocut varchar(40),
    in p_ctiporubro varchar(40)
)
BEGIN
    
    DECLARE v_anio INT;    
    DECLARE v_ultimo_id INT DEFAULT 0;
        
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT;
        ROLLBACK;
        SELECT 0 AS ncodigo, 'ERROR' AS cestado, CONCAT('FALLA: ', @p2) AS cmensaje; 
    END;
    
    IF p_nidtiporeciboingreso IS NULL OR p_nidtiporeciboingreso <= 0 THEN
        SELECT 0 AS codigo, 'ERROR' AS cresultado, 'TIPO DE RECIBO NO VÁLIDO' AS cmensaje;
    ELSEIF p_clogin IS NULL OR p_clogin = '' THEN
        SELECT 0 AS codigo, 'ERROR' AS cestado, 'EL USUARIO (CLOGIN) ES OBLIGATORIO' AS cmensaje;
    ELSEIF p_dfecharecibo IS NULL THEN
        SELECT 0 AS codigo, 'ERROR' AS cestado, 'LA FECHA DEL RECIBO ES OBLIGATORIA' AS cmensaje;
    ELSE                
        START TRANSACTION;            
            SET v_anio = YEAR(p_dfecharecibo);
            if(p_nidtreciboingreso=0) then
				INSERT INTO treciboingreso (
					nnrorecibo,
					nanio,
					nidtiporeciboingreso,
					clogin,
					dfecharecibo,
					cnumerosiaf,
					dfecharegistro,
					cobservacion,
					cnotapago,
					cexpedientesiaf,
					cordenservicio,
					cruc,
					cproveedor,
					cfactura,
					cguiaremision,
					crubro,
					ccorrelativocut,
					ctiporubro
				) VALUES (
					p_nnumerorecibo,
					v_anio,
					p_nidtiporeciboingreso,
					p_clogin,
					p_dfecharecibo,
					p_cnumerosiaf,
					NOW(),
					p_cobservacion,
					p_cnota_pago,
					p_cexpedientesiaf,
					p_cordenservicio,
					p_cruc,
					p_cproveedor,
					p_cfactura,
					p_cguiaremision,
					p_crubro,
					p_ccorrelativocut,
					p_ctiporubro
				);            
				SET v_ultimo_id = LAST_INSERT_ID();
            else
				update treciboingreso set nnrorecibo=p_nnumerorecibo,
					nanio=v_anio,
					nidtiporeciboingreso=p_nidtiporeciboingreso,                
					dfecharecibo=p_dfecharecibo,
					cnumerosiaf=p_cnumerosiaf,                
					cobservacion=p_cobservacion,
					cnotapago=p_cnota_pago,
					cexpedientesiaf=p_cexpedientesiaf,
					cordenservicio=p_cordenservicio,
					cruc=p_cruc,
					cproveedor=p_cproveedor,
					cfactura=p_cfactura,
					cguiaremision=p_cguiaremision,
					crubro=p_crubro,
					ccorrelativocut=p_ccorrelativocut,
					ctiporubro=p_ctiporubro
                where nidtreciboingreso=p_nidtreciboingreso;
                SET v_ultimo_id = p_nidtreciboingreso;
            end if;
        COMMIT;        
        SELECT v_ultimo_id AS ncodigo, 'CORRECTO' AS cestado, 'REGISTRADO' AS cmensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_registrar_solicitud_tramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_registrar_solicitud_tramite`(
    IN p_ccodigosolicitante VARCHAR(10),
    IN p_cnumerodocumento VARCHAR(10),
    IN p_cnombres VARCHAR(30),
    IN p_capellidopaterno VARCHAR(30),
    IN p_capellidomaterno VARCHAR(30),
    IN p_nidttiposolicitante INT,
    IN p_dfechapeticion DATETIME,
    IN p_ccodigos TEXT,          
    IN p_idtmontostramite TEXT,  
    IN p_cdenominaciones TEXT,   
    IN p_ncantidades TEXT,       
    IN p_nmontos TEXT            
)
BEGIN
    DECLARE v_id BIGINT;
    DECLARE v_index INT DEFAULT 1;
    DECLARE v_total INT;

    DECLARE v_ccodigo VARCHAR(20);
    DECLARE v_idtmonto INT;
    DECLARE v_cdenominacion VARCHAR(200);
    DECLARE v_ncantidad INT;
    DECLARE v_nmonto DECIMAL(10,2);
    DECLARE cidtsolicitudtramite varchar(10);
    DECLARE v_nnumerotramite INT;
    DECLARE v_dfechainicio_vigencia date;
    DECLARE v_dfechafin_vigencia date;
    
    DECLARE v_sqlstate CHAR(5);
    DECLARE v_message TEXT;
    DECLARE v_especificagasto VARCHAR(20);
    DECLARE v_comision DECIMAL(10,2);
	
    
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            v_sqlstate = RETURNED_SQLSTATE,
            v_message = MESSAGE_TEXT;

        ROLLBACK;

        SELECT 0 AS ncodigo,
               'ERROR' AS cestado,
               v_message AS cmensaje;
    END;

    START TRANSACTION;
    set p_dfechapeticion=now();
    IF NOT EXISTS (SELECT 1 FROM tsolicitante WHERE ccodigosolicitante COLLATE utf8mb4_unicode_ci = p_cnumerodocumento COLLATE utf8mb4_unicode_ci) THEN
        set p_ccodigosolicitante=p_cnumerodocumento;
        INSERT INTO tsolicitante(ccodigosolicitante, cnumerodocumento, cnombres, capellidopaterno, capellidomaterno)
        VALUES (p_ccodigosolicitante, p_cnumerodocumento, p_cnombres, p_capellidopaterno, p_capellidomaterno);
    END IF; 
	
    call tupa_sp_obtener_intervalo_vigencia(p_dfechapeticion,v_dfechainicio_vigencia,v_dfechafin_vigencia);
    
    INSERT INTO tsolicitudtramite (
        ccodigosolicitante, nidttiposolicitante, dfechapeticion, dfecharegistro, cestado,dfechainiciovigencia,dfechafinvigencia
    ) VALUES (
        p_ccodigosolicitante, p_nidttiposolicitante, p_dfechapeticion, NOW(), 'SOLICITADO',v_dfechainicio_vigencia,v_dfechafin_vigencia
    );
     
    SET v_id = LAST_INSERT_ID();	
    select ifnull(max(nnumerotramite),year(now())*1000000+1)
    into v_nnumerotramite
    from tsolicitudtramite 
    where year(dfechapeticion)=year(now());
    update tsolicitudtramite set cidtsolicitudtramite=LPAD(UPPER(CONV((v_id * 1667), 10, 36)), 6, '0'), nnumerotramite=v_nnumerotramite+1
    where nidtsolicitudtramite=v_id;
    
    select nmonto,ccodigoespecifica 
    into v_comision,v_especificagasto
    from tcomisionbanco where dfechafin IS NULL;
    
    insert into tcomisionbancoaplicacion(nidtsolicitudtramite,nidtcomisionbanco,cdescripcion,nmontocomision,ccodigoespecifica) 
    values(v_id,1,'COMISIÓN POR OPERACIÓN BANCARIA',v_comision,v_especificagasto);

    SET v_total = LENGTH(p_ccodigos) - LENGTH(REPLACE(p_ccodigos, '|', '')) + 1;
    
    WHILE v_index <= v_total DO
        SET v_ccodigo = SUBSTRING_INDEX(SUBSTRING_INDEX(p_ccodigos, '|', v_index), '|', -1);
        SET v_idtmonto = SUBSTRING_INDEX(SUBSTRING_INDEX(p_idtmontostramite, '|', v_index), '|', -1);
        SET v_cdenominacion = SUBSTRING_INDEX(SUBSTRING_INDEX(p_cdenominaciones, '|', v_index), '|', -1);
        SET v_ncantidad = SUBSTRING_INDEX(SUBSTRING_INDEX(p_ncantidades, '|', v_index), '|', -1);
        SET v_nmonto = SUBSTRING_INDEX(SUBSTRING_INDEX(p_nmontos, '|', v_index), '|', -1);

        INSERT INTO tsolicitudtramitedetalle (
            nidtsolicitudtramite, ccodigo, nidtmontotramite, ncantidad, cdescripcion, nmontotramite
        ) VALUES (
            v_id, v_ccodigo, v_idtmonto, v_ncantidad, v_cdenominacion, v_nmonto
        );
        SET v_index = v_index + 1;
    END WHILE;
    COMMIT;
    SELECT v_id AS ncodigo, 'CORRECTO' AS cestado, 'Registro ingresado' AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_registro_solicitante` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_registro_solicitante`(
    IN p_numerodocumento VARCHAR(10),
    IN p_nombres VARCHAR(30),
    IN p_apellidopaterno VARCHAR(30),
    IN p_apellidomaterno VARCHAR(30),
    OUT p_codigosolicitante VARCHAR(10),
    OUT p_mensajeestado VARCHAR(100)
)
BEGIN
    DECLARE v_prefijo VARCHAR(3) DEFAULT 'SOL';
    DECLARE v_num INT;
    DECLARE v_codigo VARCHAR(10);

    
    SELECT IFNULL(MAX(CAST(SUBSTRING(ccodigosolicitante, 4) AS UNSIGNED)), 0) + 1
    INTO v_num
    FROM tsolicitante;

    
    SET v_codigo = CONCAT(v_prefijo, LPAD(v_num, 7, '0'));

    
    INSERT INTO tsolicitante (
        ccodigosolicitante,
        cnumerodocumento,
        cnombres,
        capellidopaterno,
        capellidomaterno
    ) VALUES (
        v_codigo,
        p_numerodocumento,
        p_nombres,
        p_apellidopaterno,
        p_apellidomaterno
    );
    
    SET p_codigosolicitante = v_codigo;
    SET p_mensajeestado = CONCAT('Solicitante insertado con código ', v_codigo);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_registro_ttiporeciboingreso` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_registro_ttiporeciboingreso`(
    IN p_cdescripcion VARCHAR(250),
    IN p_cfuentefinanciamiento VARCHAR(50),
    IN p_crubro VARCHAR(300),
    IN p_ctiporecurso VARCHAR(300),
    IN p_ctipooperacion VARCHAR(200)
)
BEGIN
    DECLARE v_last_id INT;
    DECLARE v_error_message VARCHAR(255);

    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET v_error_message = 'Error al registrar el ingreso';
        SELECT 
            NULL AS ccodigo,
            'ERROR' AS cestado,
            v_error_message AS cmensaje;
    END;

    START TRANSACTION;

    INSERT INTO ttiporeciboingreso (
        cdescripcion,
        cfuentefinanciamiento,
        crubro,
        ctiporecurso,
        ctipooperacion
    ) VALUES (
        p_cdescripcion,
        p_cfuentefinanciamiento,
        p_crubro,
        p_ctiporecurso,
        p_ctipooperacion
    );

    SET v_last_id = LAST_INSERT_ID();

    COMMIT;

    SELECT 
        v_last_id AS ccodigo,
        'CORRECTO' AS cestado,
        'INGRESO REGISTRADO' AS cmensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_retornar_detalle_solicitud` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_retornar_detalle_solicitud`(
    IN p_ccodigosolicitante VARCHAR(20)
)
BEGIN
    SELECT 
		so.*,
        st.*, 
        std.*
    FROM tsolicitante so
    inner join tsolicitudtramite st
    on so.ccodigosolicitante=st.ccodigosolicitante
    INNER JOIN tsolicitudtramitedetalle std 
        ON st.nidtsolicitudtramite = std.nidtsolicitudtramite
    WHERE st.ccodigosolicitante = (p_ccodigosolicitante COLLATE utf8mb4_unicode_ci)
      AND st.cestado = 'SOLICITADO'; 
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_retornar_monto_tramite_x_codigo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tupa_sp_retornar_monto_tramite_x_codigo`(
    IN p_ccodigo VARCHAR(20)
)
BEGIN
    
    SELECT * FROM tmontotramite 
    WHERE ccodigo = p_ccodigo 
      AND dfechafin IS NULL 
    LIMIT 1; 
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_retornar_solicitante_x_nro_documento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_retornar_solicitante_x_nro_documento`(pcnumerodocumento varchar(11))
BEGIN     
	select * from tsolicitante where ccodigosolicitante = pcnumerodocumento COLLATE utf8mb4_unicode_ci;     
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_retornar_tsolicitudtramite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_retornar_tsolicitudtramite`(
  IN p_nidtsolicitudtramite INT
)
BEGIN	
    select * from tsolicitudtramite st 
    inner join tsolicitante s 
    on s.ccodigosolicitante=st.ccodigosolicitante
    where st.nidtsolicitudtramite=p_nidtsolicitudtramite ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_retornar_tsolicitudtramite_detalle` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_retornar_tsolicitudtramite_detalle`(
  IN p_nidtsolicitudtramite INT
)
BEGIN	
    select * from tsolicitudtramitedetalle st     
    where st.nidtsolicitudtramite=p_nidtsolicitudtramite ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_solicitud_tramite_pagados_o_sin_adjuntos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_solicitud_tramite_pagados_o_sin_adjuntos`()
BEGIN
	select s.ccodigosolicitante,
		   s.cnumerodocumento,
           s.cnombres,
           s.capellidopaterno,
           s.capellidomaterno,
           st.nidtsolicitudtramite,
           st.nidttiposolicitante,
           st.dfechapeticion,
           st.dfecharegistro,
           st.ccomprobantepath,
           st.cnumerotransaccion,
           st.dfechatransaccion,
           st.dhoratransaccion,
           st.cestado,
           ifnull(st.cidtsolicitudtramite,'') as cidtsolicitudtramite,
           ifnull(st.nnumerotramite,'-1') as nnumerotramite,
           st.dfechapago,
           std.nidtsolicitudtramitedetalle,
           std.ccodigo,
           std.nidtmontotramite,
           std.ncantidad,
           std.cdescripcion,
           std.nmontotramite
    from 
    tsolicitante s inner join 
    tsolicitudtramite st 
    on s.ccodigosolicitante=st.ccodigosolicitante
    inner join tsolicitudtramitedetalle std 
    on st.nidtsolicitudtramite=std.nidtsolicitudtramite
    where cestado in ('PAGADO','PAGADO SIN ADJUNTO','EN PROCESO');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_solicitud_tramite_recibo_ingreso` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_solicitud_tramite_recibo_ingreso`(p_nidtreciboingreso int)
BEGIN
	select s.ccodigosolicitante,
		   s.cnumerodocumento,
           s.cnombres,
           s.capellidopaterno,
           s.capellidomaterno,
           st.nidtsolicitudtramite,
           st.nidttiposolicitante,
           st.dfechapeticion,
           st.dfecharegistro,
           st.ccomprobantepath,
           st.cnumerotransaccion,
           st.dfechatransaccion,
           st.dhoratransaccion,
           st.cestado,
           IFNULL(st.cidtsolicitudtramite,'') as cidtsolicitudtramite,
           IFNULL(st.nnumerotramite,0) as nnumerotramite,
           st.dfechapago,
           IFNULL(st.cnumerorecibocaja,'') as cnumerorecibocaja,
           std.nidtsolicitudtramitedetalle,
           std.ccodigo,
           std.nidtmontotramite,
           std.ncantidad,
           std.cdescripcion,
           std.nmontotramite
    from
    tsolicitante s inner join 
    tsolicitudtramite st 
    on s.ccodigosolicitante=st.ccodigosolicitante
    inner join tsolicitudtramitedetalle std 
    on st.nidtsolicitudtramite=std.nidtsolicitudtramite
    inner join treciboingresodetalle rid 
    on std.nidtsolicitudtramitedetalle=rid.nidtsolicitudtramitedetalle
    where rid.nidtreciboingreso=p_nidtreciboingreso
    order by cnumerorecibocaja;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_solicitud_tramite_recibo_ingreso_especifica` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tupa_sp_solicitud_tramite_recibo_ingreso_especifica`(p_nidtreciboingreso int)
BEGIN
	select s.ccodigosolicitante,
		   s.cnumerodocumento,
           s.cnombres,
           s.capellidopaterno,
           s.capellidomaterno,
           st.nidtsolicitudtramite,
           st.nidttiposolicitante,
           st.dfechapeticion,
           st.dfecharegistro,
           st.ccomprobantepath,
           st.cnumerotransaccion,
           st.dfechatransaccion,
           st.dhoratransaccion,
           st.cestado,
           st.cidtsolicitudtramite,
           st.nnumerotramite,
           st.dfechapago,
           st.cnumerorecibocaja,
           std.nidtsolicitudtramitedetalle,
           std.ccodigo,
           std.nidtmontotramite,
           std.ncantidad,
           std.cdescripcion,
           std.nmontotramite,
           rid.ccodigoespecifica,
           ri.nnrorecibo,
           ri.dfecharecibo,
           ri.cnumerosiaf
    from
    tsolicitante s inner join 
    tsolicitudtramite st 
    on s.ccodigosolicitante=st.ccodigosolicitante
    inner join tsolicitudtramitedetalle std
    on st.nidtsolicitudtramite=std.nidtsolicitudtramite    
    inner join treciboingresodetalle rid 
    on std.nidtsolicitudtramitedetalle=rid.nidtsolicitudtramitedetalle 
    inner join treciboingreso ri
    on rid.nidtreciboingreso=ri.nidtreciboingreso
    where rid.nidtreciboingreso=p_nidtreciboingreso
    order by cnumerorecibocaja;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tupa_sp_tramites_segun_tipo_recibo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tupa_sp_tramites_segun_tipo_recibo`(
    IN p_nidtiporeciboingreso INT
)
BEGIN        
    SELECT DISTINCT c.* FROM tcatalogotramite c
    INNER JOIN tespecificatramite et ON c.ccodigo = et.ccodigo
    INNER JOIN tespecifica e ON e.ccodigoespecifica = et.ccodigoespecifica
    WHERE e.nidtiporeciboingreso = p_nidtiporeciboingreso    
    ORDER BY c.cdescripcion ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-22 20:26:52
