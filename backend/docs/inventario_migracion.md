# Inventario de Base de Datos y Procedimientos (Fase 1)

## 1. Tablas Identificadas (46)
El esquema consta de las siguientes 46 tablas, las cuales han sido migradas a DDL compatible con PostgreSQL (`SERIAL`, `BOOLEAN`, `TIMESTAMP`, etc.):
- `tserieunidadtramite`, `tcomisionbanco`, `tespecialidad`, `tlogin`, `tsolicitudtramitedetalle`, `thistorialcatalogo`, `tcatalogotramite`, `tunidadtramite`, `tcomprobantepago`, `tdetalleconfiguracion`, `texpediente`, `tnotificacion`, `tespecificatramite`, `tsolicitanteespecialidad`, `tperfil`, `trequisitotramite`, `tmovimientoexpediente`, `treciboingreso`, `tespecifica`, `contador_expediente`, `tsolicitante`, `talumnochecacupe`, `registro_auditoria`, `tdetalletramite`, `talumnocusco`, `tmodulo`, `tmontotramite`, `ttiporeciboingreso`, `tcomisionbancoaplicacion`, `ttoken`, `tdetallecomprobantepago`, `tflujoderivacion`, `tusuario`, `tconfiguracion`, `tperfildemo`, `tunidadorganizativa`, `talumno`, `treciboingresodetalle`, `tagrupadormodulo`, `tsolicitudtramite`, `tmenuperfil`, `tferiado`, `talumnocalca`, `tdocumentoexpediente`.

*(Nota: un falso positivo `IF` por la sintaxis `IF NOT EXISTS` fue limpiado del modelo final PostgreSQL).*

## 2. Procedimientos Almacenados (87)
Se identificaron 87 procedimientos en la base de datos MySQL original. Entre ellos: `tupa_sp_registrar_solicitud_tramite`, `tupa_sp_iniciar_sesion`, `tupa_sp_listar_solicitudes_tramite`, etc.

**Uso y Comportamiento:**
- **Dónde se utilizan:** En **ninguna parte** del código de la aplicación (Flask/Python).
- **Evidencia concreta:** Una búsqueda exhaustiva en todos los archivos `.py` del directorio `backend/app` arroja **0 resultados** para invocaciones como `tupa_sp_` o `callproc`. 
- **Decisión de Migración:** **Obsoletos**. La aplicación Flask está utilizando Flask-SQLAlchemy (ORM) y sentencias directas para interactuar con la base de datos. Los procedimientos almacenados son código heredado o no utilizado.
- **Acción tomada:** Se omiten completamente en el nuevo esquema `backend/database/postgresql/schema.sql`. La lógica reside actualmente en los controladores (services) de Python. No se eliminan del archivo original de MySQL, el cual se mantiene intacto como respaldo.

## 3. Triggers (0)
No se identificó ningún trigger (`CREATE TRIGGER`) en los archivos SQL originales.

## 4. Orden de Ejecución Exacto
Para reproducir la base de datos en PostgreSQL, se deben ejecutar los archivos en el siguiente orden desde la carpeta `backend/database/postgresql/`:

1. `schema.sql` (Crea la estructura base y tablas, libre de MySQL).
2. `catalogo_seed.sql` (Inserta los datos iniciales).
3. `migrations/001_auth_audit.sql`
4. `migrations/002_contador_expediente.sql`
5. `migrations/003_estados_seguimiento.sql`
6. `migrations/004_bandeja_derivacion.sql`
7. `migrations/005_dataset_sintetico.sql`
8. `migrations/006_correo_institucional_generado.sql`
9. `migrations/007_activacion_cuenta.sql`
