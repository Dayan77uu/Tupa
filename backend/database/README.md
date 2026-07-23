# Base de datos (bdtupa)

Estos archivos permiten reconstruir localmente la base de datos que usa el backend,
sin depender de una copia manual de la máquina original.

- `schema.sql` — estructura completa de las tablas de `bdtupa` (sin datos),
  incluyendo `texpediente`, `tdocumentoexpediente`, `contador_expediente`
  (Sprint 2), `tmovimientoexpediente`, `tnotificacion` (Sprint 3),
  `tflujoderivacion` + columnas de oficina en `texpediente`/`tlogin` (Sprint 4)
  y `tperfildemo`/`thistorialcatalogo` (Sprint 5).
- `catalogo_seed.sql` — datos de referencia públicos del catálogo TUPA (perfiles,
  unidades organizativas, trámites, requisitos, montos, feriados) **y los 5
  estudiantes sintéticos de `tperfildemo`** (ver más abajo — no son datos
  reales, es seguro compartirlos). No incluye usuarios, logins, auditoría,
  expedientes ni `talumno`: esos sí son reales/sensibles o específicos de cada
  entorno y no se versionan.

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
`tnotificacion`) y
[004_bandeja_derivacion.sql](../migrations/004_bandeja_derivacion.sql)
(oficina actual del expediente, motivo de rechazo de voucher, oficina por
login administrativo, `tflujoderivacion`) y
[005_dataset_sintetico.sql](../migrations/005_dataset_sintetico.sql)
(`tperfildemo`, `thistorialcatalogo`) — no hace falta aplicarlas aparte.

### Dataset sintético para desarrollo/demo (Sprint 5)

**`tperfildemo` NO representa personas reales de la UNSAAC.** Contexto: la
tabla `tpersonal` que asumía el Plan de Proyecto nunca se creó en la BD real.
`talumno` sí existe (4,522 alumnos reales), pero ninguno tiene correo
`@unsaac.edu.pe` (son todos Gmail/Hotmail personales) y 0 de los usuarios
actuales de `tusuario` coinciden con un alumno real por DNI ni por código.

Por eso se creó `tperfildemo` con 5 estudiantes ficticios (DNI `00000001`-
`00000005`, fuera de cualquier rango real) y correos `@unsaac.edu.pe`
inventados, para poder desarrollar y probar el login y el perfil sin tocar
`talumno`. **`talumno` se consulta de forma exclusivamente read-only — nunca
se le inserta ni actualiza nada.**

`app/perfil_service.py::obtener_perfil_por_dni()` es el ÚNICO punto del
sistema donde se lee nombre/carrera de un estudiante: primero intenta
`talumno` (real), y si no encuentra el DNI cae a `tperfildemo` (sintético).
Esto permite cambiar a datos reales de producción sin tocar código, una vez
que el docente confirme el origen de `bdtupa`.

Para generar el usuario demo (DNI `00000001`, prueba el fallback) y un
usuario ficticio por cada uno de los 4 roles administrativos reales:

```bash
cd backend
venv\Scripts\python.exe -m scripts.seed_dataset_sintetico
```

**Importante:** `tflujoderivacion` solo trae UNA fila de datos, marcada
explícitamente como prueba (no institucional real) — ver el comentario en la
migración 004. Hacen falta datos reales del flujo del TUPA antes de usar
derivaciones en producción.

**Nota:** `backend/uploads/` (documentos subidos) y `backend/backups/` (dumps
completos con datos reales de `talumno`) no se versionan — nunca deben subirse
a GitHub, se generan/pueblan localmente.

## Usuario de prueba

Para poder iniciar sesión (el dominio institucional exige `@unsaac.edu.pe`),
genera un usuario de prueba con:

```bash
cd backend
venv\Scripts\python.exe -m scripts.seed_test_user
```

Copia `backend/.env.example` a `backend/.env` y completa tus credenciales de MySQL
antes de correr el backend.
