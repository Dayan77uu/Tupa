# Base de datos (bdtupa)

Estos archivos permiten reconstruir localmente la base de datos que usa el backend,
sin depender de una copia manual de la máquina original.

- `schema.sql` — estructura completa de las 34 tablas de `bdtupa` (sin datos).
- `catalogo_seed.sql` — datos de referencia públicos del catálogo TUPA (perfiles,
  unidades organizativas, trámites, requisitos, montos). No incluye usuarios,
  logins ni auditoría: esos son datos reales/sensibles de la institución y no se
  versionan.

## Cómo importar

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bdtupa CHARACTER SET utf8mb4;"
mysql -u root -p bdtupa < backend/database/schema.sql
mysql -u root -p bdtupa < backend/database/catalogo_seed.sql
```

`schema.sql` ya incluye los cambios de la migración
[001_auth_audit.sql](../migrations/001_auth_audit.sql) (columnas de bloqueo en
`tlogin`, tabla `registro_auditoria`, `estado`/`nplazodias` en
`tcatalogotramite`) — no hace falta aplicarla aparte.

## Usuario de prueba

Para poder iniciar sesión (el dominio institucional exige `@unsaac.edu.pe`),
genera un usuario de prueba con:

```bash
cd backend
venv\Scripts\python.exe -m scripts.seed_test_user
```

Copia `backend/.env.example` a `backend/.env` y completa tus credenciales de MySQL
antes de correr el backend.
