# Base de datos (bdtupa)

Estos archivos permiten reconstruir localmente la base de datos que usa el backend,
sin depender de una copia manual de la máquina original.

- `schema.sql` — estructura completa de las tablas de `bdtupa` (sin datos),
  incluyendo `texpediente`, `tdocumentoexpediente`, `contador_expediente`
  (Sprint 2) y `tmovimientoexpediente`, `tnotificacion` (Sprint 3).
- `catalogo_seed.sql` — datos de referencia públicos del catálogo TUPA (perfiles,
  unidades organizativas, trámites, requisitos, montos, feriados). No incluye
  usuarios, logins, auditoría ni expedientes: esos son datos reales/sensibles o
  específicos de cada entorno y no se versionan.

## Cómo importar

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bdtupa CHARACTER SET utf8mb4;"
mysql -u root -p bdtupa < backend/database/schema.sql
mysql -u root -p bdtupa < backend/database/catalogo_seed.sql
```

`schema.sql` ya incluye los cambios de las migraciones
[001_auth_audit.sql](../migrations/001_auth_audit.sql) (columnas de bloqueo en
`tlogin`, tabla `registro_auditoria`, `estado`/`nplazodias` en
`tcatalogotramite`) y
[002_contador_expediente.sql](../migrations/002_contador_expediente.sql)
(`texpediente`, `tdocumentoexpediente`, `contador_expediente`, columnas de
checklist en `trequisitotramite`) y
[003_estados_seguimiento.sql](../migrations/003_estados_seguimiento.sql)
(5 estados de seguimiento en `texpediente.cestado`, `tmovimientoexpediente`,
`tnotificacion`) — no hace falta aplicarlas aparte.

**Nota:** `backend/uploads/` (donde se guardan los documentos subidos) no se
versiona — se crea vacía y cada quien la va poblando localmente al usar el
sistema.

## Usuario de prueba

Para poder iniciar sesión (el dominio institucional exige `@unsaac.edu.pe`),
genera un usuario de prueba con:

```bash
cd backend
venv\Scripts\python.exe -m scripts.seed_test_user
```

Copia `backend/.env.example` a `backend/.env` y completa tus credenciales de MySQL
antes de correr el backend.
