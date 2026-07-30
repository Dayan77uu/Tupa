# Base de datos (bdtupa)

Estos archivos permiten reconstruir localmente la base de datos que usa el backend,
sin depender de una copia manual de la máquina original.

- `schema.sql` — estructura completa de las tablas de `bdtupa` (sin datos),
  incluyendo `texpediente`, `tdocumentoexpediente`, `contador_expediente`
  (Sprint 2), `tmovimientoexpediente`, `tnotificacion` (Sprint 3),
  `tflujoderivacion` + columnas de oficina en `texpediente`/`tlogin` (Sprint 4),
  `tperfildemo`/`thistorialcatalogo` (Sprint 5),
  `talumno.correo_institucional_generado` (Sprint 6) y
  `tusuario_pendiente` (registro con verificación por correo, Sprint 6).
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
(`tperfildemo`, `thistorialcatalogo`) y
[006_correo_institucional_generado.sql](../migrations/006_correo_institucional_generado.sql)
(`talumno.correo_institucional_generado`) y
[007_activacion_cuenta.sql](../migrations/007_activacion_cuenta.sql)
(`tlogin.activada`) y
[008_registro_verificacion.sql](../migrations/008_registro_verificacion.sql)
(`tusuario_pendiente`) — no hace falta aplicarlas aparte.

### Registro con verificación por correo (Sprint 6, rama `pablo`)

Como `talumno` está vacía (ver más abajo) y no hay fuente real de datos de
alumnos, `POST /api/auth/registro` + `POST /api/auth/verificar-correo` son
hoy la **única vía real** para que un estudiante cree una cuenta: registro →
correo con enlace (Flask-Mail vía Gmail, contraseña de aplicación) →
verificación → cuenta activa en `tusuario`/`tlogin` directamente (sin pasar
por `activar-cuenta.html`, que se mantiene intacto por si en el futuro
aparece una fuente real de `talumno`). Las cuentas creadas así usan
`cidtusuario` con prefijo `REG` (ej. `REG0000001`) para distinguirlas a
simple vista de los DNIs reales (8 dígitos) y de las cuentas sintéticas de
demo. Configuración de correo en `backend/.env` (`MAIL_*`, ver
`.env.example`) — `MAIL_PASSWORD` es una contraseña de aplicación de Gmail
(16 caracteres), no la contraseña normal de la cuenta.

### Alumnos reales con login (Sprint 6)

**Autorización del docente (23/07/2026)**: modificar `bdtupa` con criterio del
equipo para que el sistema funcione al 100%, usando únicamente el TUPA oficial
enviado por el docente (Resolución Rectoral CU-520-2024-UNSAAC, 21/10/2024).

`talumno` tiene 4,522 alumnos reales, pero ninguno tenía correo
`@unsaac.edu.pe` (son todos Gmail/Hotmail personales, columna `email` — no se
toca). La migración 006 agrega `correo_institucional_generado`
(`codigoalumno@unsaac.edu.pe`) a los 4,522, y
`scripts/cargar_alumnos_reales.py` crea `tusuario`/`tlogin` para poder
loguearse con ese correo:

```bash
cd backend
venv\Scripts\python.exe -m scripts.cargar_alumnos_reales
```

**Limitación real de los datos, no inventada**: de los 4,522, **2,080 no
tienen DNI** en `talumno` (registros legados, código `00G...`) y **12 tienen un
DNI con formato inválido** (no son 8 dígitos). Sin DNI no hay forma de crear su
`tusuario` (es la clave de identidad en todo el sistema), así que esos
**2,092 quedan sin cuenta de login posible** — sí tienen
`correo_institucional_generado` en `talumno`, pero no pueden autenticarse.
De los 2,430 restantes, 124 DNIs se repetían en 2-3 filas (misma persona,
reingreso o doble carrera); se usó el `codigoalumno` más alto (más reciente)
de cada DNI, dando **2,306 cuentas reales creadas**, contraseña compartida de
prueba (ver el script) — no es la contraseña real de nadie, UNSAAC no expone
ese dato en `bdtupa`.

`talumno` sigue siendo exclusivamente read-only más allá de esta migración:
no se le actualiza `email`, `nombresalumno` ni ningún otro dato personal.

### Dataset sintético para desarrollo/demo (Sprint 5)

**`tperfildemo` NO representa personas reales de la UNSAAC.** Decisión de
diseño **permanente**, no un pendiente temporal: la tabla `tpersonal` que
asumía el Plan de Proyecto nunca se creó en la BD real, y no existe ninguna
fuente real de datos de personal administrativo/sistema en `bdtupa`. Por eso
`tperfildemo` se sigue usando —de forma indefinida— exclusivamente para los
roles administrativos (Personal Administrativo, Administrador del Sistema);
para estudiantes, desde Sprint 6 el dato real es `talumno` (ver arriba).

`app/perfil_service.py::obtener_perfil_por_dni()` sigue siendo el ÚNICO punto
del sistema donde se lee nombre/carrera de un estudiante: primero intenta
`talumno` (real), y si no encuentra el DNI cae a `tperfildemo` (sintético, hoy
en la práctica solo relevante para el estudiante demo `00000001`).

Para generar el usuario demo (DNI `00000001`, prueba el fallback) y un
usuario ficticio por cada uno de los 4 roles administrativos reales:

```bash
cd backend
venv\Scripts\python.exe -m scripts.seed_dataset_sintetico
```

**Actualizado en Sprint 6:** `tflujoderivacion` ya tiene datos reales del TUPA
oficial (82 filas, sobre 68 de los 141 trámites — los que sí requieren
derivación de una oficina a otra; ver más abajo). La única fila de prueba de
la migración 004 sigue existiendo aparte, sin borrarse.

**Nota:** `backend/uploads/` (documentos subidos) y `backend/backups/` (dumps
completos con datos reales de `talumno`) no se versionan — nunca deben subirse
a GitHub, se generan/pueblan localmente.

### Catálogo TUPA real (Sprint 6)

**Autorización del docente (23/07/2026)**: modificar `bdtupa` con criterio del
equipo para que el sistema funcione al 100%. El catálogo se basa
**únicamente** en el TUPA oficial enviado por el docente (Resolución Rectoral
CU-520-2024-UNSAAC, 21/10/2024) — no se investigó la resolución de INDECOPI
que ese documento referencia, por decisión del equipo.

`tcatalogotramite` pasó de 63 a **141 trámites**. El cruce CSV↔BD se hizo por
similitud de nombre (los códigos de ambas fuentes no coinciden — son
ediciones distintas del TUPA), revisado manualmente por el equipo antes de
aplicar cualquier cambio:
- **19 trámites existentes actualizados** (costo/plazo/oficina) — coincidencia
  exacta o de alta confianza (score ≥0.90) con el catálogo ya cargado.
- **18 trámites existentes actualizados** — pares de confianza media
  (score 0.55–0.89) que el equipo revisó uno por uno y confirmó como el mismo
  trámite con redacción distinta.
- **78 trámites nuevos insertados** (31 + 47) — trámites del CSV oficial que
  no existían de ninguna forma en la BD real (posgrado, residentado médico,
  modalidades especiales de admisión, subsidios, etc.).

Todos los cambios quedan en `thistorialcatalogo` con
`numero_resolucion = "RESOLUCION N. CU-520-2024-UNSAAC (21/10/2024)"`.

#### Casos de diseño sin resolver (Fase 5 — pendientes para el equipo)

Estos **no se tocaron** en la BD; quedan documentados para que el equipo
decida con más contexto:

1. **Traslado Externo vs. "Traslado Internacional"** — el TUPA oficial tiene
   un trámite "Traslado Externo" (código `PA51004007`) que no se cruzó contra
   ningún trámite existente (score <0.55) y se insertó como nuevo en la Fase 4.
   El catálogo ya tenía "TRASLADO INTERNACIONAL" (`PA8840148B7`) — ¿ese
   registro de la BD cubre también traslados nacionales, o es exclusivamente
   internacional? Si es lo primero, "Traslado Externo" podría ser un
   duplicado a fusionar.
2. **Traslado Interno: 1 trámite en BD vs. 2 en el TUPA** — el TUPA oficial
   separa "Traslado Interno... misma Facultad" y "Traslado Interno...otra
   Facultad" (ambos insertados como nuevos, sin match, en la Fase 4). La BD
   real solo tiene un trámite genérico "TRASLADO INTERNO INTER SEDES,
   ESCUELAS PROFESIONALES Y FACULTADES" (`PA884017516`). ¿Se deja así
   (3 trámites separados) o se decide una relación explícita entre ellos?
3. **Carné de Biblioteca para Docentes o Administrativos** — el catálogo real
   ya fusiona "Egresados" y "Docentes" en un solo trámite
   ("CARNET DE BIBLIOTECA EGRESADOS Y DOCENTES", `SE88401FD77`). El TUPA
   oficial trae variantes adicionales (Docentes Contratados, Docentes o
   Administrativos) que se insertaron como trámites nuevos separados en la
   Fase 3 — **no se fusionaron más** con el registro existente, para no asumir
   una equivalencia que el equipo no confirmó.

## Usuario de prueba

Para poder iniciar sesión (el dominio institucional exige `@unsaac.edu.pe`),
genera un usuario de prueba con:

```bash
cd backend
venv\Scripts\python.exe -m scripts.seed_test_user
```

Copia `backend/.env.example` a `backend/.env` y completa tus credenciales de MySQL
antes de correr el backend.
