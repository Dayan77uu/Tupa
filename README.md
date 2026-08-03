# TUPA UNSAAC

Sistema web para consulta de procedimientos, registro y seguimiento de expedientes de la UNSAAC.

## Arquitectura

- Frontend: HTML, CSS y JavaScript Vanilla (`frontend/`).
- Backend: Flask, SQLAlchemy, JWT y bcrypt (`backend/`).
- Base de datos: PostgreSQL en Supabase.
- Documentos: bucket privado de Supabase Storage.
- Despliegue: Render para la API y Cloudflare Pages para el frontend.
- Rama de despliegue: `franshesco`.

## Desarrollo local

Requiere Python 3.12 y PostgreSQL. Desde `backend/`:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Configura `backend/.env` sin versionarlo. Variables mínimas:

```env
DATABASE_URL=postgresql://usuario:contraseña@127.0.0.1:5432/base
JWT_SECRET_KEY=secreto-aleatorio
CORS_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
STORAGE_BACKEND=local
```

Arranque:

```powershell
cd backend
python run.py
```

Sirve el frontend desde su directorio:

```powershell
cd frontend
python -m http.server 8000
```

## PostgreSQL y migraciones

La fuente canónica es:

1. `backend/database/postgresql/schema.sql`
2. `backend/database/postgresql/catalogo_seed.sql`
3. Migraciones `001` a `007` en orden.

Simulación con rollback:

```powershell
cd backend
python scripts/apply_postgres_schema.py --env-file .env
```

Aplicación persistente sobre un esquema `public` vacío:

```powershell
python scripts/apply_postgres_schema.py --env-file .env --apply
```

Para un destino remoto se requiere además `--allow-remote`. El aplicador aborta si `public` no está vacío, si otro proceso mantiene el bloqueo de migración, ante el primer error SQL o si los recuentos finales difieren de:

```text
44 tablas, 318 columnas, 52 claves foráneas, 44 índices, 26 secuencias
```

## Supabase

Usa Session pooler en puerto 5432 para Render cuando se requiere IPv4. Variables privadas del backend:

```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
SUPABASE_STORAGE_BUCKET=documentos-tupa
STORAGE_BACKEND=supabase
```

El bucket `documentos-tupa` debe ser privado, limitado a 5 MB y aceptar `application/pdf`, `image/jpeg` e `image/png`. La columna `tdocumentoexpediente.crutaarchivo` guarda la ruta del objeto; las descargas pasan por una ruta autenticada del backend.

## Pruebas

```powershell
cd backend
python -m pytest -q
python -m scripts.seed_test_user
python -m scripts.seed_test_admin
python -m scripts.smoke_test_api
python -m scripts.smoke_test_document_flow
```

El script `test_pg_migration.py` está restringido a `tupa_test_1` y siempre ejecuta rollback. No debe usarse contra Supabase.

## Render

El archivo `render.yaml` define el Web Service. Configuración manual equivalente:

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 120 run:app`
- Health Check Path: `/health`

Configura en Render las variables indicadas en `backend/.env.example`. Nunca expongas `DATABASE_URL`, `JWT_SECRET_KEY` ni `SUPABASE_SECRET_KEY` en el frontend.

## Cloudflare Pages

- Production branch: `franshesco`
- Build command: ninguno
- Build output directory: `frontend`

Antes del despliegue reemplaza el marcador de Render en `frontend/static/js/config.js`. Tras obtener el dominio de Pages, añádelo a `CORS_ORIGINS` en Render.

## Rollback de aplicación

Render y Cloudflare pueden volver a desplegar un commit anterior de `franshesco`. Las migraciones de base no se revierten eliminando tablas: crea primero un respaldo de Supabase y prepara una migración compensatoria. Los objetos de Storage son persistentes e independientes de los reinicios de Render.

## Limitaciones conocidas

- SMTP debe configurarse en Render para correo real; sin esas variables las notificaciones quedan en modo simulado.
- El flujo de derivación incluido contiene datos sintéticos que deben sustituirse por información institucional validada.
- El frontend conserva un marcador de URL hasta que exista el dominio público de Render.
